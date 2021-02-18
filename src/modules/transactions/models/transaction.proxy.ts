//#region Imports

import { ApiProperty } from '@nestjs/swagger';

import { BaseCrudProxy } from '../../../common/base-crud.proxy';
import { TransactionEntity } from '../entities/transaction.entity';
import { GetManyDefaultResponseProxy } from '../../../common/get-many-default-response.proxy';

//#endregion

/**
 * A classe que representa as informações que são enviadas pela API da entidade TransactionEntity
 */
export class TransactionProxy extends BaseCrudProxy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    entity: TransactionEntity,
  ) {
    super(entity);
  }

  //#endregion

}

/**
 * A classe que representa o retorno dos proxies quando é chamado a função GetMany
 */
// tslint:disable-next-line:max-classes-per-file
export class GetManyDefaultResponseTransactionProxy extends GetManyDefaultResponseProxy {

  /**
   * A lista de entidades que essa busca retornou
   */
  @ApiProperty({ type: TransactionProxy, isArray: true })
  data: TransactionProxy[];

}
