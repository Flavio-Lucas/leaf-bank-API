//#region Imports

import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../common/base-entity';
import { ToProxy } from '../../../common/to-proxy';
import { TransactionProxy } from '../models/transaction.proxy';

//#endregion

/**
 * A class que representa a entidade que representa a tabela Transaction
 */
@Entity('transactions')
export class TransactionEntity extends BaseEntity implements ToProxy<TransactionProxy> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    partial: Partial<TransactionEntity> | TransactionEntity,
  ) {
    super();

    Object.assign(this, { ... partial });
  }

  //#endregion

  //#region Public Properties



  //#endregion

  //#region Public Methods

  /**
   * Método que retorna um proxy da entidade
   */
  public toProxy(): TransactionProxy {
    return new TransactionProxy(this);
  }

  //#endregion

}
