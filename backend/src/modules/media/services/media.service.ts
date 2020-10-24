//#region Imports

import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage/dist';
import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'path';

import { v4 } from 'uuid';

import { EnvService } from '../../env/services/env.service';
import { UserEntity } from '../../users/entities/user.entity';
import { MulterFile } from '../models/multer-file';
import { UploadImageProxy } from '../models/upload-image.proxy';
import { UploadProxy } from '../models/upload.proxy';
import { getPlaceholderImage } from '../utils/get-placeholder-image';

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

  //#region Crud Methods

  /**
   * Método que realiza o upload de uma imagem
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param file As informações do arquivo a ser hospedado
   * @param disabledPlaceholder Diz se deve desabilitar a imagem em placeholder
   */
  public async uploadImage(requestUser: UserEntity, file?: MulterFile, disabledPlaceholder: boolean = false): Promise<UploadImageProxy> {
    if (!file)
      throw new BadRequestException('É necessário enviar o arquivo que você deseja realizar o upload.');

    type ValidMimetypes = 'webp' | 'png' | 'jpeg' | 'jpg';
    const extension: ValidMimetypes = extname(file.originalname).substr(1) as ValidMimetypes;

    const uploadFile: UploadedFileMetadata = {
      mimetype: file.mimetype,
      buffer: file.buffer,
      encoding: file.encoding,
      originalname: `${ v4() }.${ extension }`,
      fieldname: `${ v4() }.${ extension }`,
      size: undefined,
      storageUrl: this.env.AZURE_CONTAINER_NAME,
    };

    const uploadedSecureUrl = await this.azure.upload(uploadFile);

    if (!uploadedSecureUrl)
      throw new BadRequestException('Não foi possível salvar a imagem, por favor, tente novamente.');

    const url = uploadedSecureUrl.split('?sv')[0];

    if (disabledPlaceholder)
      return new UploadImageProxy(url, url);

    const placeholderImage = await getPlaceholderImage(file.buffer, { outputFormat: extension, resize: 16 });

    const uploadPlaceholderFile: UploadedFileMetadata = {
      mimetype: file.mimetype,
      buffer: placeholderImage.content,
      encoding: 'buffer',
      originalname: `${ v4() }.${ extension }`,
      fieldname: `${ v4() }.${ extension }`,
      size: undefined,
      storageUrl: this.env.AZURE_CONTAINER_NAME,
    };

    const placeholderImageSecureUrl = await this.azure.upload(uploadPlaceholderFile);

    if (!placeholderImageSecureUrl)
      return new UploadImageProxy(url, url);

    const placeholderUrl = placeholderImageSecureUrl.split('?sv')[0];

    return new UploadImageProxy(url, placeholderUrl);
  }

  /**
   * Método que realiza o upload de um pdf
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param file As informações do arquivo a ser hospedado
   */
  public async uploadPdf(requestUser: UserEntity, file?: MulterFile): Promise<UploadProxy> {
    if (!file)
      throw new BadRequestException('É necessário enviar o arquivo que você deseja realizar o upload.');

    const extension = extname(file.originalname).substr(1);

    const uploadFile: UploadedFileMetadata = {
      mimetype: file.mimetype,
      buffer: file.buffer,
      encoding: file.encoding,
      originalname: `${ v4() }.${ extension }`,
      fieldname: `${ v4() }.${ extension }`,
      size: undefined,
      storageUrl: this.env.AZURE_CONTAINER_NAME,
    };

    const uploadedSecureUrl = await this.azure.upload(uploadFile);

    if (!uploadedSecureUrl)
      throw new BadRequestException('Não foi possível salvar o pdf, por favor, tente novamente.');

    const url = uploadedSecureUrl.split('?sv')[0];

    return new UploadProxy(url);
  }

  //#endregion

}
