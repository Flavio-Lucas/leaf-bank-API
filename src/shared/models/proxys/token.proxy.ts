import { ApiModelProperty } from '@nestjs/swagger';

const ms = require('ms');

import { environment } from '../../../environment/environment';

export class TokenProxy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(token: Partial<TokenProxy>) {
    Object.assign(this, token);

    const now = +new Date();
    const expiresIn = ms(environment.jwt_expires_in);

    this.expiresAt = new Date(now + expiresIn);
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
