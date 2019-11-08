//#region Imports

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { environment } from '../../environment/environment';
import { UserEntity } from '../../typeorm/entities/user.entity';

//#endregion

/**
 * A classe que representa a estrategia que lida com o JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwt_secret,
    });
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna as informações que devem ser serializadas
   *
   * @param id A identificação do usuário
   * @param email O e-mail do usuário
   * @param roles As permissões do usuário
   * @param createdAt A data de quando o usuário foi criado
   */
  public validate({ id, email, roles, createdAt }: UserEntity): Partial<UserEntity> {
    return { id, email, roles, createdAt };
  }

  //#endregion

}
