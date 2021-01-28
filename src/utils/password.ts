//#region Imports

import * as bcryptjs from 'bcryptjs';

//#endregion

/**
 * Método que usa o BCrypt para fazer o Hash da senha
 *
 * @param plainPassword A senha limpa
 */
export async function encryptPassword(plainPassword: string): Promise<string> {
  const salt = await bcryptjs.genSalt();

  return await bcryptjs.hash(plainPassword, salt);
}
