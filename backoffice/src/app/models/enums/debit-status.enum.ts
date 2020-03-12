/**
 * O enum que representa o status de uma nota de débito
 */
export enum DebitStatus {

  /**
   * Diz que o status está em modo de review
   */
  REVIEW = 0,

  /**
   * Diz se está no modo de confirmação, esperando o tomador ir e confirmar essa nota de débito
   */
  WAITING_CONFIRMATION = 1,

  /**
   * Diz se está aguardando essa nota de débito ser paga
   */
  WAITING_PAYMENT = 2,

  /**
   * Diz que essa nota está paga
   */
  PAID = 3,

}
