//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';
import { GetManyDefaultResponse } from '@nestjsx/crud';
import { ApiProperty } from '@nestjsx/crud/lib/crud';

import { BaseCrudProxy } from '../common/base-crud.proxy';
import { BaseEntity } from '../common/base-entity';

//#endregion

/**
 * O tipo da resposta que irá retornar as entidades convertidas em proxy
 */
export type CrudProxy<T> = GetManyDefaultResponse<T> | T[] | T;

/**
 * O tipo usado para especificar que é uma classe que possui um construtor
 */
export type CrudClassProxy<T, K> = new(item: K) => T;

/**
 * Método que mapeia as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 */
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity>(classInstance: CrudClassProxy<T, K>, data: GetManyDefaultResponse<K> | K[]): GetManyDefaultResponse<T>;
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity>(classInstance: CrudClassProxy<T, K>, data: K[]): T[];
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity>(classInstance: CrudClassProxy<T, K>, data: K): T;
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity>(classInstance: CrudClassProxy<T, K>, data: GetManyDefaultResponse<K> | K[] | K): GetManyDefaultResponse<T> | T[] | T {
  if (Array.isArray(data))
    return data.map(item => new classInstance(item));

  if (isGetMany<K>(data)) {
    const { data: listEntities } = data;
    const result: GetManyDefaultResponse<T> = { ...data, data: [] };

    result.data = listEntities.map(item => new classInstance(item));

    return result;
  }

  return new classInstance(data);
}

/**
 * Método que verifica se ele é do tipo GetManyDefaultResponse
 *
 * @param value O valor a ser verificado
 */
export function isGetMany<T>(value: any): value is GetManyDefaultResponse<T> {
  return value.hasOwnProperty('data') && Array.isArray(value.data);
}

/**
 * Método que retorna um tipo válido a ser exibido no Swagger para uma lista de entidades
 *
 * @param entity A entidade que está sendo listada
 * @constructor
 */
export function GetManyDefaultResponseProxy<T>(entity: T) {
  class ResponseProxy implements GetManyDefaultResponse<T> {

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

    /**
     * A lista de entidades que essa busca retornou
     */
    @ApiModelProperty({ type: entity, isArray: true })
    data: T[];
  }

  return ResponseProxy;
}
