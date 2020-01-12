//#region Imports

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para criar um usuário
 */
export class UserCreatePayload {

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário informar o e-mail.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email: string;

  /**
   * A senha do usuário
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário informar a senha.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public password: string;

  /**
   * O número de telefone do usuário
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  @IsMobilePhone('pt-BR', { message: DefaultValidationMessages.IsMobilePhone })
  public phone?: string;

  /**
   * As permissões de um usuário
   */
  @ApiModelProperty({ description: 'Only admins can change this property.' })
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public roles?: string;

}
