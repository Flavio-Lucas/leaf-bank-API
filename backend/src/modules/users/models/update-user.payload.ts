//#region Imports

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseCrudUpdatePayload } from '../../../common/base-crud-update.payload';
import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para atualizar um usuário
 */
export class UpdateUserPayload extends BaseCrudUpdatePayload {

  /**
   * O e-mail do usuário
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email?: string;

  /**
   * As folhinhas
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public leafs?: number;

  /**
   * As permissões de um usuário
   */
  @ApiPropertyOptional({ description: 'Only admins can change this property.' })
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public roles?: string;

}
