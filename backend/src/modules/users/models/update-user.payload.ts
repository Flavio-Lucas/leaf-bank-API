//#region Imports

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para atualizar um usuário
 */
export class UpdateUserPayload {

  /**
   * O e-mail do usuário
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email?: string;

  /**
   * As permissões de um usuário
   */
  @ApiPropertyOptional({ description: 'Only admins can change this property.' })
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public roles?: string;

}
