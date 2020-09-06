//#region  Imports

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserEntity } from '../../users/entities/user.entity';
import { GoogleLoginPayload } from '../models/google-login.payload';
import { AuthService } from '../../auth/services/auth.service';
import { EnvService } from '../../env/services/env.service';
import { UserService } from '../../users/services/user.service';

//#endregion

/**
 * A classe que representa o serviço que lida com as autenticações
 */
@Injectable()
export class GoogleService {

  //#region  Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) { }

  //#endregion

  //#region Private Properties

  /**
   * O serviço que realiza os logs da aplicação
   */
  private readonly logger: Logger = new Logger(GoogleService.name);

  /**
   * O cliente para verificar o token de autenticação do google
   */
  private readonly googleClient: OAuth2Client = new OAuth2Client({
    clientId: this.env.GOOGLE_CLIENT_ID,
    clientSecret: this.env.GOOGLE_CLIENT_SECRET,
  });

  //#endregion

  //#region Public Methods

  /**
   * Método que realia o login do usuário pelo Google
   *
   * @param payload As informações de autenticação
   */
  public async signInGoogle(payload: GoogleLoginPayload): Promise<TokenProxy> {
    const hasConfigForGoogleAuth = !!this.env.GOOGLE_CLIENT_ID && !!this.env.GOOGLE_CLIENT_SECRET;

    if (!hasConfigForGoogleAuth)
      throw new BadRequestException('A autenticação pelo Google não foi habilitada.');

    const { error, success: googleInfo } = await this.verifyGoogleIdToken(payload);

    if (error) {
      this.logger.error(error);

      throw new BadRequestException('Ocorreu um erro ao realizar a operação, por favor, tente novamente.');
    }

    const expiresInMilliseconds = googleInfo.exp * 1000;

    const user = await this.userService.findByEmailAndGoogleIdToken(googleInfo.email, payload.googleIdToken);

    if (user)
      return await this.authService.signIn(user, expiresInMilliseconds);

    const createdUser = new UserEntity({
      email: googleInfo.email,
      googleIdToken: payload.googleIdToken,
    });

    const userEntity = await this.userService.repository.save(createdUser).catch((e) => this.logger.error(e));

    if (userEntity)
      return await this.authService.signIn(userEntity, expiresInMilliseconds);

    throw new BadRequestException('Ocorreu um erro ao salvar as informações, por favor, tente novamente.');
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que verifica as informações de autenticação do Google
   *
   * @param payload As informações para a autenticação
   */
  private async verifyGoogleIdToken(payload: GoogleLoginPayload): Promise<{ error?: any, success?: TokenPayload }> {
    return await this.googleClient.verifyIdToken({
      idToken: payload.googleIdToken,
      audience: this.env.GOOGLE_CLIENT_ID,
    }).then(success => ({ success: success.getPayload() }))
      .catch(error => ({ error }));
  }

  //#endregion

}
