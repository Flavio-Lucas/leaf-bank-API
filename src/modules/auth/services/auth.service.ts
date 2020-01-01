//#region  Imports

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';

import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserEntity } from '../../../typeorm/entities/user.entity';
import { LoginPayload } from '../../auth-token/models/login.payload';
import { ConfigService } from '../../config/services/config.service';
import { UserService } from '../../users/services/user.service';
import { IJwtPayload } from '../models/jwt.payload';

const ms = require('ms');

//#endregion

/**
 * A classe que representa o serviço que lida com as autenticações
 */
@Injectable()
export class AuthService {

  //#region  Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que realiza o login de um usuário
   *
   * @param user As informações do usuário
   */
  public async signIn(user: Partial<UserEntity>): Promise<TokenProxy> {
    const { password, ...cleanedUser } = user;
    const token = await this.jwtService.signAsync({ ...cleanedUser }, { expiresIn: this.config.JWT_EXPIRES_IN });

    const now = +new Date();
    const expiresAt = now + ms(this.config.JWT_EXPIRES_IN);

    return new TokenProxy({ token, expiresAt });
  }

  /**
   * Método que realiza a autenticação de um usuário
   *
   * @param email O endereço de e-mail do usuário
   * @param passwordWithoutEncryption A senha do usuário
   */
  public async authenticate({ username, password: passwordWithoutEncryption }: LoginPayload): Promise<Partial<UserEntity>> {
    const { password, ...user } = await this.userService.findByEmailForAuth(username);

    const passwordIsMatch = await bcryptjs.compare(passwordWithoutEncryption, password);

    if (!passwordIsMatch)
      throw new UnauthorizedException('A senha ou o e-mail enviado estão incorretos.');

    return user;
  }

  /**
   * Método que valida um usuário com o base no payload extraido do token
   *
   * @param jwtPayload As informações extraidas do token
   */
  public async validateUserByPayload(jwtPayload: IJwtPayload): Promise<UserEntity> {
    if (!jwtPayload)
      throw new UnauthorizedException('As informações para a autenticação não foram encontradas.');

    if (!jwtPayload.iat || !jwtPayload.exp || !jwtPayload.id)
      throw new UnauthorizedException('Os detalhes para a autenticação não foram encontrados.');

    return await this.userService.findById(jwtPayload.id);
  }

  //#endregion

}
