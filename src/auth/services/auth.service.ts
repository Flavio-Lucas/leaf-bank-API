//#region  Imports

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../../typeorm/entities/user.entity';
import { TokenProxy } from '../../shared/models/proxys/token.proxy';
import { UserService } from '../../users/services/user.service';
import { LoginPayload } from '../models/login.payload';

import md5 = require('md5');

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
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que realiza o login de um usuário
   *
   * @param user As informações do usuário
   */
  public async validateUser(user: Partial<UserEntity>): Promise<TokenProxy> {
    const token = await this.jwtService.signAsync({ ...user });

    return new TokenProxy({ token });
  }

  /**
   * Método que realiza a autenticação de um usuário
   *
   * @param email O endereço de e-mail do usuário
   * @param passwordWithoutEncryption A senha do usuário
   */
  public async authenticate({ username, password: passwordWithoutEncryption }: LoginPayload): Promise<Partial<UserEntity>> {
    const { password, ...user } = await this.userService.findByEmail(username);
    const md5Password = md5(passwordWithoutEncryption);

    if (md5Password !== password)
      throw new UnauthorizedException('A senha que você digitou está incorreta.');

    return user;
  }

  //#endregion

}
