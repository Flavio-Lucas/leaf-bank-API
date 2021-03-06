//#region Imports

import { ApiProperty } from '@nestjs/swagger';

import { BaseCrudProxy } from '../../../common/base-crud.proxy';
import { GetManyDefaultResponseProxy } from '../../../common/get-many-default-response.proxy';
import { UserEntity } from '../entities/user.entity';

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

    this.name = user.name;
    this.leafs = user.leafs;
    this.email = user.email;
    this.permissions = user.roles;
  }

  //#region Public Properties

  /**
   * O e-mail do usuário
   */
  @ApiProperty()
  public email: string;

    /**
   * O e-mail do usuário
   */
  @ApiProperty()
  public leafs: number;

    /**
   * O e-mail do usuário
   */
  @ApiProperty()
  public name: string;

  /**
   * O e-mail ou RA do usuário
   */
  @ApiProperty()
  public permissions: string;

  //#endregion

}

/**
 * A classe que representa o retorno dos proxies quando é chamado a função GetMany
 */
export class GetManyDefaultResponseUserProxy extends GetManyDefaultResponseProxy {

  /**
   * A lista de entidades que essa busca retornou
   */
  @ApiProperty({ type: UserProxy, isArray: true })
  data: UserProxy[];

}
