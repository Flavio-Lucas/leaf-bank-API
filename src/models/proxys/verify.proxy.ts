//#region Imports

import { ApiProperty } from '@nestjs/swagger';

//#endregion

/***
 * A classe que representa o proxy que diz se uma entidade existe
 */
export class VerifyProxy {

  //#region Constructors

  /**
   * Construtor padrão
   */
  constructor(
    exists: boolean,
  ) {
    this.exists = exists;
  }

  //#endregion

  //#region Public Properties

  /**
   * Diz se a entidade existe
   */
  @ApiProperty()
  public exists: boolean;

  //#endregion

}
