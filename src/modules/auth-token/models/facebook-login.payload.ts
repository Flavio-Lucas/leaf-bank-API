import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

/**
 * A classe que representa as informações necessárias para realizar o login pelo facebook
 */
export class FacebookLoginPayload {

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar o e-mail do usuário.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  username: string;

  /**
   * O token de autenticação do Facebook
   */
  @ApiModelProperty()
  @IsDefined({ message: 'É necessário enviar o token de autenticação do facebook.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  facebookIdToken: string;

}
