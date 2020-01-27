//#region Imports

import { R } from '@nestjsx/crud/lib/crud';

//#endregion

/**
 * O decorador que aplica outros decoradores ou guards apenas quando uma viriável existe no ENV
 *
 * @param envName O nome da variável de ambiente
 * @param guards Os guards que serão aplicados
 */
export const ApplyDecoratorsIfEnvExists = (envName: string | string[], ...guards) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const envs = Array.isArray(envName) ? envName : [envName];

    if (envs.every(env => !!process.env[env]))
      R.setDecorators(guards, descriptor, 'value');
  };
};
