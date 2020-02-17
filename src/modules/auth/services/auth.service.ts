//#region  Imports

import { BadRequestException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';

import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import * as PassportFacebookToken from 'passport-facebook-token';

import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserEntity } from '../../../typeorm/entities/user.entity';
import { GoogleLoginPayload } from '../../auth-token/models/google-login.payload';
import { LoginPayload } from '../../auth-token/models/login.payload';
import { EnvService } from '../../env/services/env.service';
import { UserService } from '../../users/services/user.service';
import { IJwtPayload } from '../models/jwt.payload';

const ms = require('ms');

//#endregion

/**
 * A classe que representa o serviço que lida com as autenticações
 */
@Injectable()
export class AuthService {

  //#region  Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) {
  }

  //#endregion

  //#region Private Properties

  /**
   * O serviço que realiza os logs da aplicação
   */
  private readonly logger: Logger = new Logger('AuthService');

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
   * Método que realiza o login de um usuário
   *
   * @param user As informações do usuário
   * @param expiresInMilliseconds Diz quando o token deve ser expirado
   */
  public async signIn(user: Partial<UserEntity>, expiresInMilliseconds?: number): Promise<TokenProxy> {
    const { id, createdAt, updatedAt, isActive } = user;
    const expiresIn = expiresInMilliseconds && ms(expiresInMilliseconds) || this.env.JWT_EXPIRES_IN;

    const token = await this.jwtService.signAsync({
      id,
      createdAt,
      updatedAt,
      isActive,
    }, { expiresIn });

    const now = Date.now().valueOf();
    const expiresAt = now + ms(expiresIn);

    return new TokenProxy({ token: `Bearer ${ token }`, expiresAt });
  }

  /**
   * Método que realiza a autenticação de um usuário
   *
   * @param email O endereço de e-mail do usuário
   * @param passwordWithoutEncryption A senha do usuário
   */
  public async authenticate({ username, password: passwordWithoutEncryption }: LoginPayload): Promise<Partial<UserEntity>> {
    const { password, ...user } = await this.userService.findByEmailForAuth(username);

    const passwordIsMatch = await bcryptjs.compare(passwordWithoutEncryption, password);

    if (!passwordIsMatch)
      throw new UnauthorizedException('A senha ou o e-mail enviado estão incorretos.');

    return user;
  }

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

    const userEntity = await this.userService.userRepository.save(createdUser).catch((e) => this.logger.error(e));

    if (userEntity)
      return done(null, userEntity);

    throw new BadRequestException('Ocorreu um erro ao salvar as informações, por favor, tente novamente.');
  }

  /**
   * Método que valida um usuário com o base no payload extraido do token
   *
   * @param jwtPayload As informações extraidas do token
   */
  public async validateUserByPayload(jwtPayload: IJwtPayload): Promise<UserEntity> {
    if (!jwtPayload)
      throw new UnauthorizedException('As informações para a autenticação não foram encontradas.');

    if (!jwtPayload.iat || !jwtPayload.exp || !jwtPayload.id)
      throw new UnauthorizedException('Os detalhes para a autenticação não foram encontrados.');

    const now = Date.now().valueOf() / 1000;
    const jwtExpiresIn = jwtPayload.exp;

    if (now > jwtExpiresIn)
      throw new UnauthorizedException({
        error: HttpStatus.UNAUTHORIZED,
        message: 'O token de autenticação está expirado.',
        shouldLogout: true,
      });

    return await this.userService.findById(jwtPayload.id);
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

    return await this.signIn(user);
  }

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
      return await this.signIn(user, expiresInMilliseconds);

    const createdUser = new UserEntity({
      email: googleInfo.email,
      googleIdToken: payload.googleIdToken,
    });

    const userEntity = await this.userService.userRepository.save(createdUser).catch((e) => this.logger.error(e));

    if (userEntity)
      return await this.signIn(userEntity, expiresInMilliseconds);

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
