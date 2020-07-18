//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';
import { IsBase64, IsDefined, IsIn, IsString } from 'class-validator'

import { DefaultValidationMessages } from '../../../models/enums/default-validation-messages';

//#endregion

/**
 * A classe que representa o payload enviado para salvar uma imagem
 */
export class UploadImagePayload {

  /**
   * A imagem em base64
   */
  @IsDefined({ message: 'É necessário enviar o base64 da imagem para salvá-la.' })
  @IsBase64({ message: DefaultValidationMessages.IsBase64 })
  @ApiModelProperty()
  base64: string;

  /**
   * O tipo do arquivo da imagem
   */
  @IsDefined({ message: 'É necessário enviar o tipo da imagem.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsIn(['image/png', 'image/jpg', 'image/jpeg'], { message: 'É necessário que o tipo da imagem seja png, jpg, ou jpeg.' })
  @ApiModelProperty()
  mimeType: string;
}
