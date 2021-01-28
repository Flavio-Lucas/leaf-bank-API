//#region Imports

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { EnvService } from '../../env/services/env.service';
import { UserEntity } from '../../users/entities/user.entity';
import { IJwtPayload } from '../models/jwt.payload';
import { AnonymousStrategy } from '../strategies/anonymous.strategy';
import { AuthService } from './auth.service';

//#endregion

/**
 * A classe que representa o serviço que lida com a autenticação anonima
 */
@Injectable()
export class AnonymousStrategyService extends PassportStrategy(AnonymousStrategy, 'anonymous') {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly auth: AuthService,
    private readonly env: EnvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna as informações que devem ser serializadas
   *
   * @param jwt As informações do payload do usuário
   */
  public async validate(jwt: IJwtPayload): Promise<UserEntity> {
    return await this.auth.validateUserByPayload(jwt);
  }

  //#endregion

}
