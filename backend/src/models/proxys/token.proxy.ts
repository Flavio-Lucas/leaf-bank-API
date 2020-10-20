//#region Imports

import { ApiProperty } from '@nestjs/swagger';

const ms = require('ms');

//#endregion

/**
 * A classe que representa o proxy que lida com o retorno das informações do token de autenticação
 */
export class TokenProxy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(token: string, expiresIn: string | number, refreshToken: string, refreshExpireIn: string | number) {
    this.token = `Bearer ${ token }`;
    this.refreshToken = `Bearer ${ refreshToken }`;

    const now = Date.now().valueOf();

    this.expiresAt = now + ms(expiresIn);
    this.refreshExpiresAt = now + ms(refreshExpireIn);
  }

  //#endregion

  //#region Public Properties

  /**
   * O Bearer Token gerado pelo JWT
   */
  @ApiProperty()
  token: string;

  /**
   * A data de quando irá expirar
   */
  @ApiProperty()
  expiresAt: Date;

  /**
   * O Bearer Token gerado pelo JWT para atualizar e regerar um novo token
   */
  @ApiProperty()
  refreshToken: string;

  /**
   * A data de quando irá expirar o token de atualização
   */
  @ApiProperty()
  refreshExpiresAt: Date;

  //#endregion

}
