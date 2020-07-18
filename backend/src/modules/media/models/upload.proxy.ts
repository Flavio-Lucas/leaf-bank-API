//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';

//#endregion

/**
 * A classe que representa as informações após realizar o upload de um arquivo
 */
export class UploadProxy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    url: string,
  ) {
    this.url = url;
  }

  //#endregion

  //#region Public Properties

  /**
   * Url da arquivo hospedado
   */
  @ApiModelProperty()
  url: string;

  //#endregion

}
