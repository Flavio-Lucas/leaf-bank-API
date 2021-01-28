//#region Imports

import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

import { MulterFile } from '../models/multer-file';

//#endregion

/**
 * Os parâmetros da função de filtrar os arquivos
 */
export type MulterFileFilterFunction = (req: Request, file: MulterFile, callback: (error: (Error | null), acceptFile: boolean) => void) => void;

/**
 * Método que retorna a função de filtrar arquivos que valida se o mimeType está dentro da lista de aceitáveis
 *
 * @param mimeTypes Os tipos de mimeTypes que serão aceitos
 */
export function fileFilterByMimeTypes(...mimeTypes: string[]): MulterFileFilterFunction {
  return (req, file, callback) => {
    if (mimeTypes.includes(file.mimetype))
      callback(null, true);
    else
      callback(
        new BadRequestException(`Esse não é um tipo de arquivo válido, por favor, envie apenas os seguintes tipos de arquivos: ${ mimeTypes.join(', ') }.`),
        false,
      );
  };
}
