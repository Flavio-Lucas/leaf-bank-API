//#region Imports

import { Injectable, Logger } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';

import * as Mail from 'nodemailer/lib/mailer';

import * as Sentry from '@sentry/node';

import { EnvService } from '../../env/services/env.service';

//#endregion

/**
 * A classe que representa o serviço que envia os e-mails
 */
@Injectable()
export class MailService {

    //#region Constructor

    /**
     * Construtor padrão
     */
    constructor(
        private readonly env: EnvService,
    ) {
        this.initMailer(env.EMAIL_TRANSPORT)
            .catch(error => this.logger.error('Ocorreu um erro ao inializar o serviço de envio de e-mails: ', JSON.stringify(error)));
    }

    //#endregion

    //#region Private Properties

    /**
     * O serviço que envia os e-mails
     */
    private mailer: Mail;

    /**
     * O serviço que realiza o log da aplicação
     */
    private readonly logger: Logger = new Logger('MailService', true);

    //#endregion

    //#region Public Methods

    /**
     * Método que envia o e-mail
     *
     * @param options As opções para o envio de e-mail
     */
    public async sendEmail(options: Mail.Options): Promise<SentMessageInfo> {
        if (!this.mailer)
            return this.logger.warn('Não foi inicializado o serviço de envio de e-mail, por isso, não será enviado o e-mail.');

        if (this.env.isTest)
            return;

        return await this.mailer.sendMail(options).catch(error => {
            Sentry.captureException(error);

            this.logger.error('Ocorreu um erro ao enviar o e-mail.');
            this.logger.error(JSON.stringify(error));
        });
    }

    /**
     * Método que atualiza as credênciais atuais
     *
     * @param transport As credenciais
     */
    public async updateTransport(transport: string): Promise<void> {
        if (!this.mailer)
            return this.initMailer(transport);

        this.logger.debug('Fechando conexão de Email...');
        this.mailer.close();
        this.initMailer(transport);
    }

    //#endregion

    //#region Private Methods

    /**
     * Método que inicializa o serviço de enviar e-mail
     *
     * @param transport As credenciais
     */
    private async initMailer(transport: string): Promise<void> {
        this.logger.debug('Criando uma nova conexão...');
        this.mailer = createTransport(`${ transport }/?pool=true`);
        this.logger.debug('Conexão criada com sucesso.');
    }

    //#endregion

}
