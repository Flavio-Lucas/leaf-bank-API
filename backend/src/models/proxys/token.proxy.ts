import { ApiModelProperty } from '@nestjs/swagger';

export class TokenProxy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(token: Partial<TokenProxy>) {
    Object.assign(this, token);
  }

  //#endregion

  //#region Public Properties

  /**
   * O Bearer Token gerado pelo JWT
   */
  @ApiModelProperty()
  token: string;

  /**
   * A data de quando irá expirar
   */
  @ApiModelProperty()
  expiresAt: Date;

  //#endregion

}
