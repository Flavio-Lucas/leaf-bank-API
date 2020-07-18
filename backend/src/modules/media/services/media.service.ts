//#region Imports

import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage/dist';
import { BadRequestException, Injectable, UnsupportedMediaTypeException } from '@nestjs/common';

import { v4 } from 'uuid';

import { UserEntity } from '../../../typeorm/entities/user.entity';
import { EnvService } from '../../env/services/env.service';
import { UploadImagePayload } from '../models/upload-image.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com as medias da aplicação
 */
@Injectable()
export class MediaService {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly env: EnvService,
    private readonly azure: AzureStorageService,
  ) { }

  //#endregion

  //#region Private Properties

  /**
   * Método que diz quais sao os tipos de midia permitidos para imagens
   */
  private imageMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg'];

  //#endregion

  //#region Crud Methods

  /**
   * Método que realiza o upload de uma imagem
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para o upload da imagem
   */
  public async uploadImage(requestUser: UserEntity, payload: UploadImagePayload): Promise<string> {
    if (!this.imageMimeTypes.some(mimeType => mimeType === payload.mimeType))
      throw new UnsupportedMediaTypeException(`É necessário enviar a imagem com tipo de arquivo: ${ this.imageMimeTypes.join(', ') }.`);

    return await this.uploadImageToAzure(payload);
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que realiza o upload de uma imagem para o Azure
   *
   * @param payload As informações para o upload da imagem
   */
  private async uploadImageToAzure(payload: UploadImagePayload): Promise<string> {
    const extension = payload.mimeType.split('/')[1];

    const uploadFile: UploadedFileMetadata = {
      mimetype: payload.mimeType,
      buffer: new Buffer(payload.base64, 'base64'),
      encoding: 'base64',
      originalname: `${ v4() }.${ extension }`,
      fieldname: `${ v4() }.${ extension }`,
      size: undefined,
      storageUrl: this.env.AZURE_CONTAINER_NAME,
    };

    const url = await this.azure.upload(uploadFile);

    if (!url)
      throw new BadRequestException('Não foi possível salvar a imagem, por favor, tente novamente.');

    const cleanedUrl = url.split('?sv')[0];

    return cleanedUrl;
  }

  //#endregion

}
