//#region Imports

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { AnonymousStrategy } from '../../../common/anonymous.strategy';
import { UserEntity } from '../../../typeorm/entities/user.entity';
import { EnvService } from '../../env/services/env.service';

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
