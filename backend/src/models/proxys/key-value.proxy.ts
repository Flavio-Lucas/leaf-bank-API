//#region Imports

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { DefaultValidationMessages } from '../enums/default-validation-messages';

//#endregion

/**
 * A classe que representa as especificações
 */
export class KeyValueProxy {

  /**
   * A chave para acessar o valor
   */
  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar a chave do valor a ser salvo.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  key: string;

  /**
   * O valor dessa especificação
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  value?: string;

}
