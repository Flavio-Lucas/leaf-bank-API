//#region Imports

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * A classe que representa as informações necessárias para realizar o login pelo Google
 */
export class GoogleLoginPayload {

  /**
   * O token de autenticação do Google
   */
  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar o token de autenticação do google.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  googleIdToken: string;

}
