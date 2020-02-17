//#region Imports

import { Injectable, Logger } from '@nestjs/common';
import { Profile } from 'passport-facebook-token';

import * as FacebookTokenStrategy from 'passport-facebook-token';
import { use } from 'passport';

import { EnvService } from '../../env/services/env.service';
import { AuthService } from './auth.service';

//#endregion

/**
 * A classe que representa a estratégia do Facebook para realizar o Login
 */
@Injectable()
export class FacebookStrategy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly auth: AuthService,
    private readonly env: EnvService,
  ) {
    this.init();
  }

  //#endregion

  //#region Private Properties

  /**
   * A instância para o serviço de log
   */
  private readonly logger: Logger = new Logger('FacebookStrategy');

  //#endregion

  /**
   * Método que inicializa a estratégia
   */
  public init(): void {
    const hasConfigForFacebookAuth = !!this.env.FACEBOOK_CLIENT_ID && !!this.env.FACEBOOK_CLIENT_SECRET;

    if (!hasConfigForFacebookAuth)
      return this.logger.warn('Login com o Facebook desativado. Não foram encontradas as configurações para a autenticação com Facebook.');

    this.logger.log('Login com o Facebook ativado.');

    use(
      new FacebookTokenStrategy(
        {
          clientID: this.env.FACEBOOK_CLIENT_ID,
          clientSecret: this.env.FACEBOOK_CLIENT_SECRET,
          fbGraphVersion: 'v3.0',
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => {
          return await this.auth.authenticateByFacebook(accessToken, profile, done);
        },
      ),
    );
  }
}
