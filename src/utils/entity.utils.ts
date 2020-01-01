//#region Imports

import { ValidationOptions } from 'class-validator';

//#endregion

/**
 * Método que remove as opções adicionadas para o crud
 */
export function removeCrudOptions({ groups, always, ...validOptions }: ValidationOptions): ValidationOptions {
  return { ...validOptions };
}
