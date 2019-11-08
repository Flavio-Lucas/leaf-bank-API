//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../enums/default-validation-messages';

//#endregion

/**
 * A classe que representa o payload enviado para checar uma rota
 */
export class VerifyPayload {

  /**
   * O id que será ignorado para não retornar um falso positivo
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar o ID que será ignorado.' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  ignoreId: number;

  /**
   * O url canonico a ser checado
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar o url que será checado' })
  @IsString({ message: DefaultValidationMessages.IsString })
  canonicalUrl: string;

}
