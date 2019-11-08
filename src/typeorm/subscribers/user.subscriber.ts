//#region Imports

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

const md5 = require('md5');

import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { UserService } from '../../users/services/user.service';

//#endregion

/**
 * A classe que representa as inscrições para a entidade do usuário
 */
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly userService: UserService,
  ) {
    this.connection.subscribers.push(this);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna a entidade que esse subscriber está escutando
   */
  public listenTo(): Function {
    return UserEntity;
  }

  /**
   * Método que realiza alguns procedimentos padrões antes de salvar um usuário
   */
  public async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    const alreadyHasUser = await this.userService.userRepository.findOne({ where: { email: event.entity.email } });

    if (alreadyHasUser)
      throw new BadRequestException('Já existe um usuário cadastrado com esse e-mail.');

    event.entity.password = md5(event.entity.password);
    event.entity.roles = 'user';
  }

  //#endregion

}
