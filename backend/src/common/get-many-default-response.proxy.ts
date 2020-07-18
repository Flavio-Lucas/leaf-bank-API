//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';

//#endregion

/**
 * A classe que representa as informações básicas de toda entidade que será enviada para o usuário
 */
export class GetManyDefaultResponseProxy {

  /**
   * A contagem de quantos items veio nessa busca limitado pelo pageCount
   */
  @ApiModelProperty()
  count: number;

  /**
   * O total de itens que essa busca pode retornar
   */
  @ApiModelProperty()
  total: number;

  /**
   * A página na qual está essa busca
   */
  @ApiModelProperty()
  page: number;

  /**
   * A quantidade de itens que deve retornar por página
   */
  @ApiModelProperty()
  pageCount: number;

}
