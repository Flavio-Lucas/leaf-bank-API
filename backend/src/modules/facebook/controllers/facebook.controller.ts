//#region Imports

import { ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApplyDecoratorsIfEnvExists } from '../../../decorators/apply-if-env-exists/apply-if-env-exists.decorator';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { NestJSRequest } from '../../../utils/type.shared';
import { FacebookService } from '../services/facebook.service';

//#endregion

/**
 * A classe que representa o construtor que lida com as autenticações
 */
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class FacebookController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly facebookService: FacebookService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna o token do usuário
   *
   * @param req As informações da requisição
   * @param payload As informações para o login
   */
  @ApiQuery({ name: 'access_token', description: 'O token de autenticação do facebook', required: true, type: 'string' })
  @ApiOkResponse({ description: 'O usuário foi logado com sucesso', type: TokenProxy })
  @ApiBadRequestResponse({ description: 'O token de autenticação não é válido.' })
  @Post('/facebook')
  @ApplyDecoratorsIfEnvExists(['FACEBOOK_CLIENT_ID', 'FACEBOOK_CLIENT_SECRET'], UseGuards(AuthGuard('facebook-token')))
  public async loginByFacebook(@Request() req: NestJSRequest): Promise<TokenProxy> {
    return await this.facebookService.signInFacebook(req.user);
  }

  //#endregion

}
