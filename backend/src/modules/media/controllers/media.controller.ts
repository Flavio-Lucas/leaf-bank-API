//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { RolesEnum } from '../../auth/models/roles.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { UploadImagePayload } from '../models/upload-image.payload';
import { UploadProxy } from '../models/upload.proxy';
import { MediaService } from '../services/media.service';

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

  //#region Public Static Properties

  /**
   * O tamanho máximo de arquivos que podem ser feito o upload.
   */
  public static readonly MAX_FILE_SIZE: number = 268435456;

  //#endregion

  //#region Public Methods

  /**
   * Método que enviar a imagem para o Azure
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação da entidade
   */
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  @Post('/upload/image')
  @ApiOperation({ summary: 'Upload image to the server.' })
  @ApiOkResponse({ type: UploadProxy })
  public async uploadImage(@User() requestUser: UserEntity, @Body() payload: UploadImagePayload): Promise<UploadProxy> {
    return await this.service.uploadImage(requestUser, payload)
      .then(imageUrl => new UploadProxy(imageUrl));
  }

  //#endregion

}
