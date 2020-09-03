//#region Imports

import { GetManyDefaultResponse } from '@nestjsx/crud';

import { BaseCrudProxy } from '../common/base-crud.proxy';
import { BaseEntity } from '../common/base-entity';
import { isValid } from './functions';

//#endregion

/**
 * O tipo da resposta que irá retornar as entidades convertidas em proxy
 */
export type CrudProxy<T> = GetManyDefaultResponse<T> | T[] | T;

/**
 * O tipo usado para especificar que é uma classe que possui um construtor
 */
export type CrudClassProxy<T, K> = new(item: K, ...params: unknown[]) => T;

/**
 * Método que mapeia as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param proxyParams Os parâmetros a mais passados para o proxy
 */
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data: K, ...proxyParams: P[]): T;

/**
 * Método que mapeia as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param proxyParams Os parâmetros a mais passados para o proxy
 */
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data: K[], ...proxyParams: P[]): T[];

/**
 * Método que mapeia as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param proxyParams Os parâmetros a mais passados para o proxy
 */
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data: GetManyDefaultResponse<K> | K[], ...proxyParams: P[]): GetManyDefaultResponse<T>;

/**
 * Método que mapeia as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param proxyParams Os parâmetros a mais passados para o proxy
 */
export function mapCrud<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data: GetManyDefaultResponse<K> | K[] | K, ...proxyParams: P[]): GetManyDefaultResponse<T> | T[] | T {
  if (Array.isArray(data))
    return data.map(item => new classInstance(item, ...proxyParams));

  if (isGetMany<K>(data)) {
    const { data: listEntities } = data;
    const result: GetManyDefaultResponse<T> = { ...data, data: [] };

    result.data = listEntities.map(item => new classInstance(item, ...proxyParams));

    return result;
  }

  return new classInstance(data, ...proxyParams);
}

/**
 * Método que mapeia, se estiverem válidas, as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * Caso não seja válido, e seja um array, ele retorna um array vázio.
 *
 * Caso não seja válido, e seja um objeto, ele retorna undefined.
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param isArray Diz se os dados mapeados são um array
 * @param proxyParams Os parâmetros passados para o proxy
 */
export function mapCrudIfValid<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data: K[], isArray: boolean, ...proxyParams: P[]): T[];

/**
 * Método que mapeia, se estiverem válidas, as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * Caso não seja válido, e seja um array, ele retorna um array vázio.
 *
 * Caso não seja válido, e seja um objeto, ele retorna undefined.
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param proxyParams Os parâmetros passados para o proxy
 */
export function mapCrudIfValid<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data: K, ...proxyParams: P[]): T | undefined;

/**
 * Método que mapeia, se estiverem válidas, as entidades buscadas pelo crud e retorna uma versão com o Proxy do objeto
 *
 * Caso não seja válido, e seja um array, ele retorna um array vázio.
 *
 * Caso não seja válido, e seja um objeto, ele retorna undefined.
 *
 * @param classInstance A classe proxy usada para limpar quaisquer propriedades que não devam ser enviadas
 * @param data As informações que precisam ser mapeadas
 * @param isArrayOrParams Diz se a lista é um array ou representa os restos dos parametros
 * @param proxyParams O resto dos parametros
 */
export function mapCrudIfValid<T extends BaseCrudProxy, K extends BaseEntity, P>(classInstance: CrudClassProxy<T, K>, data?: K[] | K, isArrayOrParams?: boolean | P[], ...proxyParams: P[]): T[] | T {
  if (Array.isArray(data))
    return data.map(item => new classInstance(item, ...(Array.isArray(isArrayOrParams) ? isArrayOrParams : proxyParams)));

  if (isValid(data))
    return new classInstance(data, isArrayOrParams, ...proxyParams);

  if (typeof isArrayOrParams === 'boolean' && isArrayOrParams)
    return [];

  return void 0;
}

/**
 * Método que verifica se ele é do tipo GetManyDefaultResponse
 *
 * @param value O valor a ser verificado
 */
export function isGetMany<T>(value: any): value is GetManyDefaultResponse<T> {
  return value.hasOwnProperty('data') && Array.isArray(value.data);
}
