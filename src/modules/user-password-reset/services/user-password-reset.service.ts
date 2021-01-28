//#region Imports

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { randomBytes } from 'crypto';

import { MoreThan } from 'typeorm';

import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';
import { EnvService } from '../../env/services/env.service';
import { MailService } from '../../mail/services/mail.service';
import { UserEntity } from '../../users/entities/user.entity';
import { UserPasswordResetEntity } from '../entities/user-password-reset.entity';
import { getEmailTemplateForResetPassword } from '../models/default.template';
import { ForgotPasswordProxy } from '../models/forgot-password.proxy';
import { ResetPasswordPayload } from '../models/reset-password.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com o reset de senha do usuário
 */
@Injectable()
export class UserPasswordResetService {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly mailService: MailService,
    private readonly envService: EnvService,
  ) { }

  //#endregion

  //#region Crud Methods

  /**
   * Método que reseta a senha de um usuário pelo e-mail
   *
   * @param email O e-mail do usuário que quer resetar a senha
   */
  public async forgotPasswordByEmail(email: string): Promise<ForgotPasswordProxy> {
    if (!email)
      throw new BadRequestException('O e-mail enviado é inválido.');

    const user = await UserEntity.findOne({ where: { email, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new UnauthorizedException('Não foi encontrado um usuário com o e-mail fornecido.');

    return await this.forgotPasswordForUser(user);
  }

  /**
   * Método que reseta a senha de um usuário
   *
   * @param resetPasswordCode O código para resetar a senha
   * @param payload As informações para resetar a senha
   */
  public async resetPasswordByCode(resetPasswordCode: string, payload: ResetPasswordPayload): Promise<void> {
    if (!resetPasswordCode)
      throw new BadRequestException('O código de resetar a senha é invalido.');

    resetPasswordCode = String(resetPasswordCode).toUpperCase();

    const now = +new Date();
    const resetPasswordEntity = await UserPasswordResetEntity.findOne({
      where: {
        resetPasswordCode,
        validUntil: MoreThan(now),
      },
      order: {
        createdAt: 'ASC',
      },
    });

    if (!resetPasswordEntity || !resetPasswordEntity.isActive)
      throw new NotFoundException('Não foi encontrado uma tentativa de resetar a senha com esse código, por favor, verifique no seu e-mail se o código informado é válido.');

    const user = await UserEntity.findById<UserEntity>(resetPasswordEntity.userId);

    const salt = await bcryptjs.genSalt();

    user.password = await bcryptjs.hash(payload.newPassword, salt);
    resetPasswordEntity.isActive = false;

    await user.save();
    await resetPasswordEntity.save();
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que reseta a senha de um usuário pelo CPF
   *
   * @param user As informações do usuário que quer resetar a senha
   */
  public async forgotPasswordForUser(user: UserEntity): Promise<ForgotPasswordProxy> {
    const resetPasswordCode = randomBytes(4).toString('hex').toUpperCase();
    const unixDay = 24 * 60 * 60 * 1000;
    const validUntil = +new Date() + unixDay;

    const resetPasswordEntity = new UserPasswordResetEntity({
      userId: user.id,
      resetPasswordCode,
      validUntil,
    });

    await UserPasswordResetEntity.update({
      isActive: true,
      userId: user.id,
    }, {
      isActive: false,
    });
    await resetPasswordEntity.save();

    const subject = '[LIGA] Resetar a senha';
    const emailTemplateForResetPassword = getEmailTemplateForResetPassword(
      subject,
      'Alerta',
      'Para resetar a sua senha, basta usar o código abaixo e colocar no aplicativo para você poder resetar a sua senha.',
      resetPasswordEntity.resetPasswordCode,
    );
    const sendEmailWithSuccess = await this.mailService.sendEmail({
      subject,
      from: this.envService.EMAIL_TRANSPORT,
      to: user.email,
      html: emailTemplateForResetPassword,
    });

    return new ForgotPasswordProxy(
      !!sendEmailWithSuccess,
      validUntil,
    );
  }

  //#endregion

}
