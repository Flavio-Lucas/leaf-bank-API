//#region Imports

import { Type, ValidationPipe } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { RolesEnum } from '../modules/auth/models/roles.enum';
import { UserEntity } from '../modules/users/entities/user.entity';

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
 * Método que diz se o usuário é um usuário de administrador
 *
 * @param user As informações do usuário
 */
export function isAdminUser(user?: UserEntity): boolean {
  return user && user.roles && hasRole(user.roles, RolesEnum.ADMIN);
}

/**
 * Método que diz se o usuário é um usuário de administrador
 *
 * @param user As informações do usuário
 */
export function isNormalUser(user?: UserEntity): boolean {
  return user && user.roles && hasRole(user.roles, RolesEnum.USER);
}

/**
 * Método que diz se o usuário é um usuário de administrador
 *
 * @param roles As permissões de um usuário
 * @param targetRole A permissão que você está procurando
 */
export function hasRole(roles: string, targetRole: string): boolean {
  return isValid(roles) && roles.split('|').some(role => role === targetRole);
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

/**
 * Método que limpa e reseta algumas configurações passadas para a requisição CRUD
 *
 * @param crudRequest As informações da requisição da biblioteca Nestjx/Crud
 */
export function resetFiltersOnCrud(crudRequest: CrudRequest): CrudRequest {
  crudRequest.parsed.or = [];
  crudRequest.parsed.filter = [];
  crudRequest.parsed.paramsFilter = [];

  return crudRequest;
}

/**
 * Método que valida e transforma um objeto plano em um Payload
 *
 * Exemplo:
 * ```TypeScript
 * const userPayload = await validatePayload(CreateUserPayload, { name: 'Joga10' });
 * const user = await this.userService.create(userPayload);
 * ```
 *
 * Se falhar, ele irá lançar a mesma exceção que um Payload inválido
 * enviado pelo cliente lançaria.
 *
 * Se der certo, você terá uma objeto com a mesma instância que o
 * payload, é útil quando você precisa usar o `instanceof`.
 *
 * @param payloadClass A classe do Payload
 * @param payloadObject O objeto a ser validado e transformado
 */
export async function validatePayload<T>(payloadClass: ClassType<T> | Type<T>, payloadObject: T): Promise<T> {
  const validation = new ValidationPipe({ whitelist: true });
  const payloadValidated = await validation.transform(payloadObject, { type: 'body', metatype: payloadClass });

  return plainToClass(payloadClass, payloadValidated);
}
