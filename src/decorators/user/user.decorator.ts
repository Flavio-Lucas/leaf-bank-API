//#region Imports

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//#endregion

/**
 * O decorador que extrai as informações do usuário da requisição
 */
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
},);
