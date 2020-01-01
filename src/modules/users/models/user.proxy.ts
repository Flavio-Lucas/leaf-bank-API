//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';

import { BaseCrudProxy } from '../../../common/base-crud.proxy';
import { UserEntity } from '../../../typeorm/entities/user.entity';

//#endregion

/**
 * A classe que representa as informações do usuário que a API enviará para o usuário
 */
export class UserProxy extends BaseCrudProxy {

  /**
   * Construtor padrão
   *
   * @param user As informações do usuário
   */
  constructor(user: Partial<UserEntity> | UserEntity) {
    super(user);

    this.email = user.email;
  }

  //#region Public Properties

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  public email: string;

  //#endregion

}
