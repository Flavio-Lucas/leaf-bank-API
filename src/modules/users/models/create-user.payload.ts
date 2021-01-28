//#region Imports

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * As informações enviadas para criar um usuário
 */
export class CreateUserPayload {

  /**
   * O e-mail do usuário
   */
  @ApiProperty()
  @IsDefined({ message: 'É necessário informar o e-mail.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email: string;

  /**
   * A senha do usuário
   */
  @ApiProperty()
  @IsDefined({ message: 'É necessário informar a senha.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public password: string;

  /**
   * As folhinas
   */
  @ApiProperty()
  @IsDefined({ message: 'É necessário informar a quantidade de folhinas' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  public leafs: number;

  /**
   * As permissões de um usuário
   */
  @ApiProperty({ description: 'Only admins can change this property.' })
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public roles?: string;

}
