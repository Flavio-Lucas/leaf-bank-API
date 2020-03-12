/**
 * A classe que representa o payload enviado para checar uma rota
 */
export class VerifyPayload {

  /**
   * O id que será ignorado para não retornar um falso positivo
   */
  ignoreId: number;

  /**
   * O url canonico a ser checado
   */
  canonicalUrl: string;

}
