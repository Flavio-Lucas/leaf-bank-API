//#region Imports

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../enums/default-validation-messages';

//#endregion

/**
 * A classe que representa o payload usado para criar uma configuração
 */
export class CreateEnvPayload {

  /**
   * O chave para acessar esse valor
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar uma chave para identificar essa nova configuração. ' })
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
