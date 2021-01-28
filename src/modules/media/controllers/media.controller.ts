//#region Imports

import { ClassSerializerInterceptor, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { RolesEnum } from '../../auth/models/roles.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { ApiFile } from '../decorators/api-file';
import { MulterFile } from '../models/multer-file';
import { UploadImageProxy } from '../models/upload-image.proxy';
import { UploadProxy } from '../models/upload.proxy';
import { MediaService } from '../services/media.service';
import { fileFilterByMimeTypes } from '../utils/file-filter';

//#endregion

/**
 * A classe que representa o construtor que lida com as medias da aplicação
 */
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('media')
@Controller('media')
export class MediaController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly service: MediaService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que enviar a imagem para o Azure
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param file As informações do arquivo a ser hospedado
   * @param disabledPlaceholder Diz se deve desabilitar as imagens em placeholder
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Post('/upload/image')
  @ApiOperation({ summary: 'Upload image to the server.' })
  @ApiOkResponse({ type: UploadImageProxy })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilterByMimeTypes('image/png', 'image/jpeg', 'image/jpg', 'image/webp'),
  }))
  @ApiFile('file')
  @ApiQuery({ name: 'disabledPlaceholder', description: 'Should disabled generation of placeholder image?', required: false, example: 'false' })
  public async uploadImage(@User() requestUser: UserEntity, @UploadedFile() file?: MulterFile, @Query('disabledPlaceholder') disabledPlaceholder?: string): Promise<UploadImageProxy> {
    return await this.service.uploadImage(requestUser, file, disabledPlaceholder === 'true');
  }

  /**
   * Método que enviar um pdf para o Azure
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param file As informações do arquivo a ser hospedado
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Post('/upload/pdf')
  @ApiOperation({ summary: 'Upload pdf to the server.' })
  @ApiOkResponse({ type: UploadProxy })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilterByMimeTypes('application/pdf'),
  }))
  @ApiFile('file')
  public async uploadPdf(@User() requestUser: UserEntity, @UploadedFile() file?: MulterFile): Promise<UploadProxy> {
    return await this.service.uploadPdf(requestUser, file);
  }

  //#endregion

}
