//#region Imports

import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

//#endregion

/**
 * A classe usada para traduzir a paginação para português
 */
@Injectable()
export class MatPaginatorIntlBr extends MatPaginatorIntl {

  //#region Public Properties

  /**
   * O texto que vai na label indicando os itens por página
   */
  public itemsPerPageLabel = 'Itens por página';

  /**
   * O texto para o botão de ir para a pŕoxima página
   */
  public nextPageLabel = 'Próxima página';

  /**
   * o texto para o botão de ir para a página anterior
   */
  public previousPageLabel = 'Página anterior';

  /**
   * O texto para o botão de avançar para a primeira página
   */
  public firstPageLabel = 'Primeira página';

  /**
   * O texto para o botão de avançar para a última página
   */
  public lastPageLabel = 'Última página';

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna a label para o range de itens
   *
   * @param page A página atual
   * @param pageSize O tamanho da página
   * @param length A quantidade de itens
   */
  public getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0)
      return '0 de ' + length;

    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };

  //#endregion

}
