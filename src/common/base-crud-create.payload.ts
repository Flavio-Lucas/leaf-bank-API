//#region Imports

import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { DefaultValidationMessages } from '../models/enums/default-validation-messages';

//#endregion

/**
 * A classe que representa as informações básicas para criar uma entidade
 */
export class BaseCrudCreatePayload {

  /**
   * Diz se deve ativar a entidade assim que criar
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  @IsBoolean({  message: DefaultValidationMessages.IsBoolean })
  isActive?: boolean;

}
