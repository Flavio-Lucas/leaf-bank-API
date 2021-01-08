//#region Imports

import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ForgotPasswordProxy } from '../models/forgot-password.proxy';
import { ResetPasswordPayload } from '../models/reset-password.payload';
import { UserPasswordResetService } from '../services/user-password-reset.service';

//#endregion

/**
 * A classe que representa o construtor que lida com o reset de senhas do usuário
 */
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users/password')
@Controller('users/password')
export class UserPasswordResetController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly service: UserPasswordResetService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que envia o e-mail para resetar a senha pelo e-mail do usuário
   *
   * @param email O endereço de e-mail do usuário
   */
  @ApiOperation({ summary: 'Send reset password by e-mail.' })
  @Post('forgot/email/:email')
  @ApiOkResponse({ type: ForgotPasswordProxy })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiBadRequestResponse({ description: 'The e-mail is invalid.' })
  public async forgotPasswordByEmail(@Param('email') email: string): Promise<ForgotPasswordProxy> {
    return await this.service.forgotPasswordByEmail(email);
  }

  /**
   * Método que reseta a senha do usuário através de um código
   *
   * @param resetPasswordCode O código usado para resetar a senha
   * @param payload As informações para resetar a senha
   */
  @ApiOperation({ summary: 'Reset password of the user.' })
  @Post('reset/:resetPasswordCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: void 0 })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiBadRequestResponse({ description: 'The resetPasswordCode is invalid.' })
  public async resetPasswordByCode(@Param('resetPasswordCode') resetPasswordCode: string, @Body() payload: ResetPasswordPayload): Promise<void> {
    return await this.service.resetPasswordByCode(resetPasswordCode, payload);
  }

  //#endregion

}
