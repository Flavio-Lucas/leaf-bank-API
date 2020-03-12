//#region  Imports

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

import * as PassportFacebookToken from 'passport-facebook-token';

import { UserEntity } from '../../../typeorm/entities/user.entity';
import { AuthService } from '../../auth/services/auth.service';
import { EnvService } from '../../env/services/env.service';
import { UserService } from '../../users/services/user.service';

//#endregion

/**
 * A classe que representa o serviço que lida com as autenticações
 */
@Injectable()
export class FacebookService {

  //#region  Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly env: EnvService,
  ) { }

  //#endregion

  //#region Private Properties

  /**
   * O serviço que realiza os logs da aplicação
   */
  private readonly logger: Logger = new Logger(FacebookService.name);

  //#endregion

  //#region Public Methods

  /**
   * Método que realiza a autenticação do usuário pelo Facebook
   */
  public async authenticateByFacebook(accessToken: string, profile: PassportFacebookToken.Profile, done: (error: any, user?: any, info?: any) => void): Promise<void> {
    const [email] = profile.emails || [];

    if (!email || !email.value)
      throw new BadRequestException('As informações do usuário não são válidas.');

    const user = await this.userService.findByEmailAndFacebookIdToken(email.value, accessToken);

    if (user)
      return done(null, user);

    const createdUser = new UserEntity({
      email: email.value,
      facebookIdToken: accessToken,
    });

    const userEntity = await this.userService.repository.save(createdUser).catch((e) => this.logger.error(e));

    if (userEntity)
      return done(null, userEntity);

    throw new BadRequestException('Ocorreu um erro ao salvar as informações, por favor, tente novamente.');
  }

  /**
   * Método que realiza o login pelo Facebook
   *
   * @param user As informações do usuário
   */
  public async signInFacebook(user: UserEntity) {
    const hasConfigForFacebookAuth = !!this.env.FACEBOOK_CLIENT_ID && !!this.env.FACEBOOK_CLIENT_SECRET;

    if (!hasConfigForFacebookAuth)
      throw new BadRequestException('A autenticação pelo Facebook não foi habilitada.');

    if (!user)
      throw new BadRequestException('O token de autenticação não é válido.');

    Sentry.setUser({ id: user.id.toString(), email: user.email });

    return await this.authService.signIn(user);
  }

  //#endregion

}