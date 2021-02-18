//#region Imports

import { BaseCrudCreatePayload } from '../../../common/base-crud-create.payload';
import { UserProxy } from '../../users/models/user.proxy';
import { ManyToOne } from 'typeorm';

//#endregion

/**
 * A classe que representa o payload enviado para criar um TransactionEntity
 */
export class CreateTransactionPayload extends BaseCrudCreatePayload {

  /**
   * Atributo da relação
   */
  @ManyToOne(() => UserProxy)
  public user: UserProxy;

}
