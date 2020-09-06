//#region Imports

import { filterXSS } from 'xss';

//#endregion

/**
 * Método que limpa o e-mail de qualquer ataque ou problema
 *
 * @param email O endereço de e-mail
 */
export function getCleanedEmail(email: string): string {
  return filterXSS(email.trim().toLocaleLowerCase());
}
