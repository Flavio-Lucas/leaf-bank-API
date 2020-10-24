//#region Imports

import { ApiProperty } from '@nestjs/swagger';

import { UploadProxy } from './upload.proxy';

//#endregion

/**
 * A classe que representa as informações após realizar o upload de um arquivo
 */
export class UploadImageProxy extends UploadProxy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    url: string,
    placeholderImage: string,
  ) {
    super(url);

    this.placeholderImageUrl = placeholderImage;
  }

  //#endregion

  //#region Public Properties

  /**
   * O placeholder da imagem que pode ser salvo na própria entidade no qual está usando a imagem
   */
  @ApiProperty()
  placeholderImageUrl: string;

  //#endregion

}
