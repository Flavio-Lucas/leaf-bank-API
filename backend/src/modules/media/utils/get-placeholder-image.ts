//#region Imports

import { UnsupportedMediaTypeException } from '@nestjs/common';
import * as sharp from 'sharp';
import { JpegOptions } from 'sharp';

//#endregion

//#region Interfaces

/**
 * A interface que representa as informações de customização da imagem de placeholder
 */
export interface PlaceholderImageOptions {
  /**
   * O tamanho resultante da imagem em px
   *
   * @default 8
   */
  resize?: number;

  /**
   * O formato da imagem de placeholder resultante
   */
  outputFormat?: 'webp' | 'jpg' | 'jpeg' | 'png';

  /**
   * As opções de customização passadas para o sharp
   */
  outputOptions?: JpegOptions;
}

/**
 * A interface que representa as informações resultantes do processamento do sharp
 */
export interface PlaceholderImageResult {

  /**
   * O Buffer com a imagem resultante do processamento
   */
  content: Buffer;

  /**
   * As informações de metadata resultante
   */
  metadata: {

    /**
     * O altura original da imagem
     */
    originalHeight: number;

    /**
     * A largura original da imagem
     */
    originalWidth: number;

    /**
     * A largura resultante da imagem
     */
    width: number;

    /**
     * A altura resultante da imagem
     */
    height: number;

    /**
     * O formato da imagem
     *
     * @example png
     */
    type: string;

    /**
     * O base64 da imagem resultante
     */
    dataURIBase64: string;
  };
}

//#endregion

/**
 * Método que retorna as informações de uma imagem em placeholder processada pelo sharp
 *
 * @param input A imagem a ser processada
 * @param opts As opções de customização
 */
export async function getPlaceholderImage(input: Buffer, opts: PlaceholderImageOptions = {}): Promise<PlaceholderImageResult> {
  const { resize = 8, outputFormat = 'jpeg', outputOptions } = opts;

  const image = sharp(input).rotate();
  const metadata = await image.metadata();

  const resized = image.resize(
    ...(Array.isArray(resize)
      ? resize
      : [
        Math.min(metadata.width, resize),
        Math.min(metadata.height, resize),
        { fit: 'inside' },
      ]),
  );

  let output;

  if (outputFormat === 'webp') {
    output = resized.webp({
      quality: 20,
      alphaQuality: 20,
      smartSubsample: true,
      ...outputOptions,
    });
  } else if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
    output = resized.jpeg({
      quality: 20,
      ...outputOptions,
    });
  } else if (outputFormat === 'png') {
    output = resized.png({
      quality: 20,
      ...outputOptions,
    });
  } else {
    throw new UnsupportedMediaTypeException(`O formato ${ outputFormat } no qual você quer gerar uma imagem placeholder não é suportado.`);
  }

  const { data, info } = await output.toBuffer({ resolveWithObject: true });

  return {
    content: data,
    metadata: {
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      width: info.width,
      height: info.height,
      type: outputFormat,
      dataURIBase64: `data:image/${ outputFormat };base64,${ data.toString('base64') }`,
    },
  };
}
