//#region Imports

import { UserEntity } from '../typeorm/entities/user.entity';

//#endregion

/**
 * Método que verifica se o valor é nulo ou indefinido
 *
 * @param value O valor a ser verificado
 */
export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * Método que verifica se o valor enviado é um valor válido ( ou seja, não nulo ou indefinido )
 *
 * @param value O valor a ser verificado
 */
export function isValid(value: any): boolean {
  return !isNullOrUndefined(value);
}

/**
 * Método que diz se o usuário é um usuário normal ( não admin )
 *
 * @param user As informações do usuário
 */
export function isNormalUser(user?: UserEntity): boolean {
  return !user || user && user.roles && !user.roles.includes('admin');
}

/**
 * Método que remove os valores de uma lista de valores de um objeto
 *
 * @param obj O objeto alvo
 * @param includes Diz que deve incluir não importa o que
 * @param ignores A lista de valores a serem ignorados
 */
export function removeValues(obj: object, includes: any[] = [], ignores: any[] = [null, undefined, '']): object {
  const isNonEmpty = d => includes.includes(d) || !ignores.includes(d) && (typeof(d) !== 'object' || Object.keys(d).length);

  return JSON.parse(JSON.stringify(obj), (k, v) => {
    if (isNonEmpty(v))
      return v;
  });
}
