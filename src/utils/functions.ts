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
  return !user || user && user.roles && !isAdmin(user.roles);
}

/**
 * Método que diz se o usuário é um usuário de administrador
 *
 * @param user As informações do usuário
 */
export function isAdminUser(user?: UserEntity): boolean {
  return user && user.roles && isAdmin(user.roles);
}
/**
 * Método que diz se o usuário é um usuário de administrador
 *
 * @param roles As permissões de um usuário
 */
export function isAdmin(roles: string): boolean {
  return isValid(roles) && roles.split('|').some(role => role === 'debit.admin' || role === 'admin');
}

/**
 * Método que remove os valores de uma lista de valores de um objeto
 *
 * @param obj O objeto alvo
 * @param includes Diz que deve incluir não importa o que
 * @param ignores A lista de valores a serem ignorados
 */
export function removeValues(obj: object, includes: any[] = [], ignores: any[] = [null, undefined, '']): object {
  const isNonEmpty = d => includes.includes(d) || !ignores.includes(d) && (typeof (d) !== 'object' || Object.keys(d).length);

  return JSON.parse(JSON.stringify(obj), (k, v) => {
    if (isNonEmpty(v))
      return v;
  });
}

/**
 * Método que separa um array em um array de arrays com tamanhos específicos
 *
 * @param array O array que será particionado
 * @param size O tamanho das partições
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunked = [];

  for (const element of array) {
    const last = chunked[chunked.length - 1];

    if (last && last.length !== size)
      last.push(element);
    else
      chunked.push([element]);
  }

  return chunked;
}
