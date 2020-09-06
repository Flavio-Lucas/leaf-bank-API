//#region Imports

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvService } from '../../env/services/env.service';
import { UserEntity } from '../../users/entities/user.entity';
import { IRefreshJwtPayload } from '../models/refresh-jwt.payload';
import { AuthService } from './auth.service';

//#endregion

/**
 * A classe que representa a estrategia que lida com a atualização do Token JWT
 */
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refreshjwt') {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly auth: AuthService,
    env: EnvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
      jsonWebTokenOptions: {
        expiresIn: env.JWT_EXPIRES_IN,
      },
    });
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna as informações que devem ser serializadas
   *
   * @param jwtPayload As informações obtidas do token
   */
  public async validate(jwtPayload: IRefreshJwtPayload): Promise<Partial<UserEntity>> {
    return await this.auth.validateUserForRefreshTokenByPayload(jwtPayload);
  }

  //#endregion

}
