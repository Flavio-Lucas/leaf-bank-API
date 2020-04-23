//#region Imports

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';

import { Repository } from 'typeorm';

import * as xss from 'xss';

import { BaseCrudService } from '../../../common/base-crud.service';
import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';
import { UserEntity } from '../../../typeorm/entities/user.entity';
import { isAdmin, isAdminUser, isValid } from '../../../utils/functions';
import { CreateUserPayload } from '../models/create-user.payload';
import { UpdateUserPayload } from '../models/update-user.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com os usuários
 */
@Injectable()
export class UserService extends BaseCrudService<UserEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    @InjectRepository(UserEntity)
    public repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  //#endregion

  //#region Crud Methods

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  public async get(requestUser: UserEntity, entityId: number, crudRequest: CrudRequest): Promise<UserEntity> {
    if (entityId !== requestUser.id && !isAdminUser(requestUser))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    const { exists } = await this.exists([entityId]);

    if (!exists)
      throw new NotFoundException('A entidade procurada não existe.');

    return super.getOne(crudRequest);
  }

  /**
   * Método que cria uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação
   */
  public async create(requestUser: UserEntity, payload: CreateUserPayload): Promise<UserEntity> {
    const isUserAdmin = isAdmin(requestUser.roles);
    const entity = this.getEntityFromPayload(payload, null, isUserAdmin);

    return await this.repository.save(entity);
  }

  /**
   * Método que atualiza as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  public async update(requestUser: UserEntity, entityId: number, payload: UpdateUserPayload): Promise<UserEntity> {
    if (entityId !== requestUser.id && !isAdmin(requestUser.roles))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    const { exists } = await this.exists([entityId]);

    if (!exists)
      throw new NotFoundException('A entidade procurada não existe.');

    const entity = this.getEntityFromPayload(payload, entityId, isAdmin(requestUser.roles));

    return await this.repository.save(entity);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que encontra um usuário para a validação de autenticação
   *
   * @param email O e-mail do usuário
   */
  public async findByEmailForAuth(email: string): Promise<Partial<UserEntity>> {
    const cleanedEmail = this.getCleanedEmail(email);
    const user = await this.repository.findOne({ where: { email: cleanedEmail, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  /**
   * Método que retorna um usuário baseado no seu id
   *
   * @param id A identificação do usuário
   */
  public async findById(id: number): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  /**
   * Método que retorna as informações do usuário pelo e-mail e ID Token do Facebook
   *
   * @param email O endereço de e-mail do usuário
   * @param facebookIdToken O token de autenticação
   */
  public async findByEmailAndFacebookIdToken(email: string, facebookIdToken: string): Promise<UserEntity | undefined> {
    const cleanedEmail = this.getCleanedEmail(email);

    return await this.repository.findOne({
      where: {
        email: cleanedEmail,
        facebookIdToken,
        isActive: TypeOrmValueTypes.TRUE,
      },
    });
  }

  /**
   * Método que retorna as informações do usuário pelo e-mail e ID Token do Google
   *
   * @param email O endereço de e-mail do usuário
   * @param googleIdToken O token de autenticação
   */
  public async findByEmailAndGoogleIdToken(email: string, googleIdToken: string): Promise<UserEntity | undefined> {
    const cleanedEmail = this.getCleanedEmail(email);

    return await this.repository.findOne({
      where: {
        email: cleanedEmail,
        googleIdToken,
        isActive: TypeOrmValueTypes.TRUE,
      },
    });
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que limpa o e-mail de qualquer ataque ou problema
   *
   * @param email O endereço de e-mail
   */
  private getCleanedEmail(email: string): string {
    return xss.filterXSS(email.trim().toLocaleLowerCase());
  }

  /**
   * Método que retorna a entidade a partir de um payload
   *
   * @param payload As informações do payload
   * @param id A identificação do usuário
   * @param isUserAdmin Diz se é admin
   */
  private getEntityFromPayload(payload: CreateUserPayload | UpdateUserPayload, id?: number, isUserAdmin: boolean = false): UserEntity {
    return new UserEntity({
      ...isValid(id) && { id },
      ...isValid(payload.email) && { email: payload.email },
      ...payload instanceof CreateUserPayload && isValid(payload.password) && { password: payload.password },
      ...isUserAdmin && { roles: payload.roles },
    });
  }

  //#endregion

}
