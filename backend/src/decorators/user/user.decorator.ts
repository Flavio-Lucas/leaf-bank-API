//#region Imports

import { createParamDecorator } from '@nestjs/common';

//#endregion

/**
 * O decorador que extrai as informações do usuário da requisição
 */
export const User = createParamDecorator((data, req) => {
  return req.user;
});
