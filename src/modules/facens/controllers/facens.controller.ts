//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiTags } from '@nestjs/swagger';

import { TokenProxy } from '../../../models/proxys/token.proxy';
import { NestJSRequest } from '../../../utils/type.shared';
import { FacensLoginPayload } from '../models/facens-login.payload';
import { FacensService } from '../services/facens.service';

//#endregion

/**
 * A classe que representa o construtor que lida com as autenticações
 */
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class FacensController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly service: FacensService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna o token do usuário
   *
   * @param req As informações da requisição
   * @param payload As informações para o login
   */
  @ApiOkResponse({ description: 'O usuário foi logado com sucesso', type: TokenProxy })
  @ApiUnauthorizedResponse({ description: 'A senha digitada está incorreta.' })
  @ApiNotFoundResponse({ description: 'Não foi encontrado um usuário com esse e-mail.' })
  @UseGuards(AuthGuard('facens'))
  @Post('facens')
  public async loginByFacens(@Request() req: NestJSRequest, @Body() payload: FacensLoginPayload): Promise<TokenProxy> {
    return await this.service.signIn(req.user);
  }

  //#endregion

}
