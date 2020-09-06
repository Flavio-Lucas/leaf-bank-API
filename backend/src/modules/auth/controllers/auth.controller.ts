//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiTags, ApiForbiddenResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { Roles } from '../../../decorators/roles/roles.decorator';
import { RolesGuard } from '../../../guards/roles/roles.guard';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { NestJSRequest } from '../../../utils/type.shared';
import { LoginPayload } from '../models/login.payload';
import { AuthService } from '../services/auth.service';

//#endregion

/**
 * A classe que representa o construtor que lida com as autenticações
 */
@ApiTags('auth')
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
  @ApiOperation({ summary: 'Returns the auth token of user by e-mail and password.' })
  @ApiOkResponse({ description: 'O usuário foi logado com sucesso', type: TokenProxy })
  @ApiUnauthorizedResponse({ description: 'A senha digitada está incorreta.' })
  @ApiNotFoundResponse({ description: 'Não foi encontrado um usuário com esse e-mail.' })
  @UseGuards(AuthGuard('local'))
  @Post('/local')
  public async login(@Request() req: NestJSRequest, @Body() payload: LoginPayload): Promise<TokenProxy> {
    return await this.authService.signIn(req.user);
  }

  /**
   * Método que atualiza e retorna um novo token do usuário
   *
   * @param req As informações da requisição
   */
  @Roles('refreshjwt')
  @UseGuards(AuthGuard('refreshjwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh auth token of the current user.' })
  @ApiForbiddenResponse({ description: 'Você não tem permissão para acessar essa funcionalidade' })
  @ApiOkResponse({ description: 'O token foi atualizado com sucesso.', type: TokenProxy })
  @ApiNotFoundResponse({ description: 'Não foi encontrado um usuário com esse e-mail.' })
  @Post('/refresh')
  public async refreshToken(@Request() req: NestJSRequest): Promise<TokenProxy> {
    return await this.authService.signIn(req.user);
  }

  //#endregion

}
