//#region Imports

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

import * as Sentry from '@sentry/node';
import * as bcryptjs from 'bcryptjs';

import * as decode from 'jwt-decode';

import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserEntity } from '../../users/entities/user.entity';
import { LoginPayload } from '../../auth/models/login.payload';
import { FacensTokenProxy } from '../models/facens-token.proxy';
import { AuthService } from '../../auth/services/auth.service';
import { EnvService } from '../../env/services/env.service';
import { HttpAsyncService } from '../../http-async/services/http-async.service';
import { UserService } from '../../users/services/user.service';
import { ClaimsEnum } from '../models/claims.enum';
import { LoginFacensPayload } from '../models/login-facens.payload';
import { TokenFacensProxy } from '../models/token-facens.proxy';
import { UserFacensDetailProxy } from '../models/user-facens-detail.proxy';

//#endregion

/**
 * A classe que representa o serviço que lida com as requisições HTTP para a Facens
 */
@Injectable()
export class FacensService {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly env: EnvService,
    private readonly http: HttpAsyncService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  //#endregion

  //#region Authentication Methods

  /**
   * Método que realiza a autenticação de um usuário
   *
   * @param email O endereço de e-mail do usuário
   * @param passwordWithoutEncryption A senha do usuário
   */
  public async authenticateByFacens({ username, password: passwordWithoutEncryption }: LoginPayload): Promise<Partial<UserEntity>> {
    const authToken = await this.getAuthForAPI(username, passwordWithoutEncryption);
    const roles = this.getFacensRoles(authToken);

    const user = await this.findOrSynchronizeUserForFacensAuth(username, passwordWithoutEncryption, roles);

    Sentry.setUser({ id: user.id.toString(), email: user.email });

    return user;
  }

  /**
   * Método que realiza o login de um usuário
   *
   * @param user As informações do usuário
   * @param expiresInMilliseconds Diz quando o token deve ser expirado
   */
  public async signIn(user: Partial<UserEntity>, expiresInMilliseconds?: number): Promise<TokenProxy> {
    return await this.authService.signIn(user);
  }

  //#endregion

  //#region API Methods

  /**
   * Método que verifica se um nome de usuário existe na Facens
   *
   * @param username O nome de usuário a ser verificado
   */
  public async isUsernameExistsAPI(username: string): Promise<boolean> {
    const token = await this.getAdminAuthToken();

    const { error } = await this.http.post<FacensTokenProxy>(`${ this.env.FACENS_API_ENDPOINT }/auth/login/admin/${ username }`, {}, { headers: { Authorization: token } });

    if (error)
      return false;

    return true;
  }

  /**
   * Método que retorna os detalhes de um usuário da Facens
   *
   * @param username O nome de usuário
   */
  public async getUserDetailAPI(username: string): Promise<UserFacensDetailProxy> {
    const token = await this.getAdminAuthToken();

    const { success, error } = await this.http.get<UserFacensDetailProxy>(`${ this.env.FACENS_API_ENDPOINT }/auth/user/detail/un/${ username }`, { headers: { Authorization: token } });

    if (error)
      throw new NotFoundException('O usuário enviado não foi encontrado na base de dados da Facens.');

    return success;
  }

  /**
   * Método que adiciona uma permissão para o usuário
   *
   * @param username O nome do usuário
   * @param role A permissão que será adicionada
   */
  public async addRoleToUserAPI(username: string, role: string): Promise<void> {
    const userDetail = await this.getUserDetailAPI(username);

    if (userDetail.roles.some(userRole => userRole === role))
      return;

    if (this.env.isTest)
      return;

    const token = await this.getAdminAuthToken();

    const { error } = await this.http.post<any>(`${ this.env.FACENS_API_ENDPOINT }/auth/user/role/${ username }?role=${ role }`, {}, { headers: { Authorization: token } });

    if (!error)
      return;

    throw new BadRequestException(error.response.data.message);
  }

  /**
   * Método que remove uma permissão do usuário
   *
   * @param username O nome do usuário
   * @param role A permissão que será adicionada
   */
  public async removeRoleFromUserAPI(username: string, role: string): Promise<void> {
    const userDetail = await this.getUserDetailAPI(username);

    if (userDetail.roles.every(userRole => userRole !== role))
      return;

    if (this.env.isTest)
      return;

    const token = await this.getAdminAuthToken();

    const { error } = await this.http.delete<any>(`${ this.env.FACENS_API_ENDPOINT }/auth/user/role/${ username }?role=${ role }`, { headers: { Authorization: token } });

    if (!error)
      return;

    throw new BadRequestException(error.response.data.message);
  }

  /**
   * Método que retorna as informações de autenticação da Facens de um usuário qualquer
   *
   * @param username O nome de usuário a ser autenticado
   * @param plainPassword A senha do usuário
   */
  private async getAuthForAPI(username: string, plainPassword: string): Promise<string> {
    const payload: LoginFacensPayload = {
      username,
      password: plainPassword,
    };

    const { error, success } = await this.http.post<TokenFacensProxy>(`${ this.env.FACENS_API_ENDPOINT }/auth/login/body`, payload);

    if (error) {
      if (error.response && error.response.status < 200 || error.response && error.response.status > 299)
        throw new BadRequestException('Usuário ou senha inválidos.');

      throw new InternalServerErrorException('Desculpe, não conseguimos realizar a autenticação no serviço necessário para realizar sua operação, se o erro persistir, contacte os administradores.');
    }

    return success.token;
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que retorna ou sincroniza e cria um usuário pelo seu username e senha
   *
   * @param username O RA ou e-mail da Facens do usuário
   * @param password A senha do usuário
   * @param roles As permissões do usuário
   */
  public async findOrSynchronizeUserForFacensAuth(username: string, password: string, roles: string): Promise<UserEntity> {
    const user = await UserEntity.findOne({ where: { email: username, isActive: TypeOrmValueTypes.TRUE } });

    if (user) {
      user.roles = roles;

      const salt = await bcryptjs.genSalt();
      user.password = await bcryptjs.hash(password, salt);

      return await user.save();
    }

    const userEntity = new UserEntity({
      email: username,
      password,
      roles,
    });

    return await userEntity.save();
  }

  /**
   * Método que retorna as informações de autenticação da Facens de um usuário administrador
   */
  private async getAdminAuthToken(): Promise<string> {
    return await this.getAuthForAPI(this.env.FACENS_ADMIN_USER, this.env.FACENS_ADMIN_PASSWORD);
  }

  /**
   * Método que extrai as permissões do usuário pelo token da Facens
   *
   * @param token As informações do token de autorização
   */
  private getFacensRoles(token: string): string {
    const tokenPayload = decode(token);
    const roles = tokenPayload[ClaimsEnum.ROLES];
    const rolesString = Array.isArray(roles) && roles.join('|');

    if (typeof rolesString !== 'string')
      throw new UnauthorizedException('Você não possui autorização para realizar essa ação.');

    return rolesString;
  }

  //#endregion

}
