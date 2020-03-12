/**
 * A interface que representa os detalhes de um usuário enviados pela API da Facens
 */
export interface UserFacensDetailProxy {
  /**
   * O nome de usuário
   */
  username: string;

  /**
   * O CPF desse usuário
   */
  cpf: string;

  /**
   * A ultima atualização da permissão desse usuário
   */
  lastUpdateRole: string;

  /**
   * A lista de permissões
   */
  roles: string[];

  /**
   * A identificação do usuário
   */
  id: string;

  /**
   * Diz se o usuário está ativo
   */
  active: boolean;

}
