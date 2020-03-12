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
    this.permissions = user.roles;
  }

  //#region Public Properties

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  public email: string;

  /**
   * O e-mail ou RA do usuário
   */
  @ApiModelProperty()
  public permissions: string;

  //#endregion

}
