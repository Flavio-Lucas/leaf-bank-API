//#region Imports

import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../enums/default-validation-messages';

//#endregion

/**
 * A classe que representa o payload usado para atualizar uma configuração
 */
export class UpdateEnvPayload {

  /**
   * O chave para acessar esse valor
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  key: string;

  /**
   * O valor armazenado nessa chave
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  value: string;

}
