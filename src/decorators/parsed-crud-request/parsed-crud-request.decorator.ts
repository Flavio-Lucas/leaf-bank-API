//#region Imports

import { createParamDecorator } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { PARSED_CRUD_REQUEST_KEY } from '@nestjsx/crud/lib/constants';

import omitDeep from 'omit-deep';

import { removeValues } from '../../utils/functions';
import { NestJSRequest } from '../../utils/type.shared';

//#endregion

/**
 * A constante que representa o decorador para lidar com validação e tomar cuidado com as Query feitas pelo CrudAuth
 */
export const ParsedCrudRequest = createParamDecorator(
  (_, req: NestJSRequest): ParameterDecorator => {
    const crudRequest: CrudRequest = req[PARSED_CRUD_REQUEST_KEY];

    const keysAvailable = Object.keys(crudRequest.options.query.join || {});
    const keysNeeded = (crudRequest.parsed.join || []).map(join => join.field);
    const keysToRemove = keysAvailable.filter(key => keysNeeded.indexOf(key) === -1);
    const keysMapped = keysToRemove
      .map(joinKey => [joinKey, `${joinKey}Id`, `${joinKey}.isActive`])
      .reduce((acc, joinListKey) => [...acc, ...joinListKey], []);

    if (keysMapped.length === 0)
        return crudRequest as any;

    crudRequest.parsed.search = omitDeep(crudRequest.parsed.search, keysMapped);
    crudRequest.parsed.search = removeValues(crudRequest.parsed.search, [null]);

    return crudRequest as any;
  },
);
