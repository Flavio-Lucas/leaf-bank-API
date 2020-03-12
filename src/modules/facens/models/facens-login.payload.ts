//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';

import { IsDefined, IsString, MinLength } from 'class-validator';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * A classe que representa o payload enviado para realizar login
 */
export class FacensLoginPayload {

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar o RA ou e-mail do usuário.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  username: string;

  /**
   * A senha do usuário
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar a senha do usuário.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MinLength(1, { message: 'A senha precisa ter no mínimo 1 caracteres.' })
  password: string;

}
