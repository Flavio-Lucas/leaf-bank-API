//#region Imports

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { EnvService } from '../../env/services/env.service';
import { UserEntity } from '../../users/entities/user.entity';
import { AnonymousStrategy } from '../strategies/anonymous.strategy';

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
   * @param user As informações do usuário
   */
  public async validate(user: UserEntity): Promise<UserEntity> {
    return await UserEntity.findById(user.id);
  }

  //#endregion

}
