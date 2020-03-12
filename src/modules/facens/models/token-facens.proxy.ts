/**
 * A interface que representa o token de autenticação enviado pela Facens
 */
export interface TokenFacensProxy {

  /**
   * O Bearer Token gerado pelo JWT
   */
  token: string;

  /**
   * A data de quando irá expirar
   */
  expiresAt: string;

}
