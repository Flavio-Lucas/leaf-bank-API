//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiImplicitQuery, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiUseTags } from '@nestjs/swagger';

import { ApplyDecoratorsIfEnvExists } from '../../../decorators/apply-if-env-exists/apply-if-env-exists.decorator';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { NestJSRequest } from '../../../utils/type.shared';
import { GoogleLoginPayload } from '../../auth-token/models/google-login.payload';
import { LoginPayload } from '../../auth-token/models/login.payload';
import { AuthService } from '../services/auth.service';

//#endregion

/**
 * A classe que representa o construtor que lida com as autenticações
 */
@ApiUseTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly authService: AuthService,
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
  @UseGuards(AuthGuard('local'))
  @Post('/local')
  public async login(@Request() req: NestJSRequest, @Body() payload: LoginPayload): Promise<TokenProxy> {
    return await this.authService.signIn(req.user);
  }

  /**
   * Método que retorna o token do usuário
   *
   * @param req As informações da requisição
   * @param payload As informações para o login
   */
  @ApiImplicitQuery({  name: 'access_token', description: 'O token de autenticação do facebook', required: true, type: 'string' })
  @ApiOkResponse({ description: 'O usuário foi logado com sucesso', type: TokenProxy })
  @ApiBadRequestResponse({ description: 'O token de autenticação não é válido.' })
  @Post('/facebook')
  @ApplyDecoratorsIfEnvExists(['FACEBOOK_CLIENT_ID', 'FACEBOOK_CLIENT_SECRET'], UseGuards(AuthGuard('facebook-token')))
  public async loginByFacebook(@Request() req: NestJSRequest): Promise<TokenProxy> {
    return await this.authService.signInFacebook(req.user);
  }

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
