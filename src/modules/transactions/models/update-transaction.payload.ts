//#region Imports

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

import { BaseCrudUpdatePayload } from '../../../common/base-crud-update.payload';
import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * A classe que representa o payload enviado para atualizar um TransactionEntity
 */
export class UpdateTransactionPayload extends BaseCrudUpdatePayload {



}
