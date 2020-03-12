//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Post, Request, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

import { TokenProxy } from '../../../models/proxys/token.proxy';
import { NestJSRequest } from '../../../utils/type.shared';
import { GoogleLoginPayload } from '../models/google-login.payload';
import { GoogleService } from '../services/google.service';

//#endregion

/**
 * A classe que representa o construtor que lida com as autenticações
 */
@ApiUseTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class GoogleController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly authService: GoogleService,
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
  @ApiBadRequestResponse({ description: 'As informações do usuário não são válidas.' })
  @Post('/google')
  public async loginByGoogle(@Request() req: NestJSRequest, @Body() payload: GoogleLoginPayload): Promise<TokenProxy> {
    return await this.authService.signInGoogle(payload);
  }

  //#endregion

}
