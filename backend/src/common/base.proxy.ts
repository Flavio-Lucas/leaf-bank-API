/**
 * A classe base para os proxys retornados
 */
export class BaseProxy<TModel> {

  /**
   * Construtor padrão
   */
  constructor(
    partial: Partial<TModel>,
  ) {
    Object.assign(this, partial);
  }

}
