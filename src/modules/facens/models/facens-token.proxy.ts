/**
 * A interface que representa o proxy enviado pela API da Facens com as informações de autenticação
 */
export interface FacensTokenProxy {
  /**
   * As informações sobre o token
   */
  token: string;

  /**
   * A data de expiração desse Token
   */
  expiration: string;
}
