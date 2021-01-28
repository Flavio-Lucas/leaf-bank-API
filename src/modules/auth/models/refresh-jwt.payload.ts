/**
 * A interface que representa as informações obtidas pelo token de autenticação de atualização
 */
export interface IRefreshJwtPayload {

  /**
   * A identificação do usuário
   */
  refreshId: number;

  /**
   * O tempo em UNIX de quando foi gerado
   */
  iat?: number;

  /**
   * O tempo em UNIX de quando será expirado
   */
  exp?: number;
}
