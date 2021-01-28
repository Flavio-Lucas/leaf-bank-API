//#region Imports

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import * as Sentry from '@sentry/node';

import { Request, Response } from 'express';

import { EnvService } from '../modules/env/services/env.service';

//#endregion

/**
 * A classe que representa o interceptor que captura erros e envia para a sentry.io
 */
@Catch()
export class SentryFilter implements ExceptionFilter {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly env: EnvService,
  ) { }

  //#endregion

  //#region Private Properties

  /**
   * O serviço que lida com os logs da aplicação
   */
  private readonly logger: Logger = new Logger('SentryFilter');

  //#endregion

  /**
   * Método que lida com as exceções lançadas
   *
   * @param exception A exceção que foi lançada
   * @param host Os argumentos de host
   */
  public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let exceptionResponse: HttpException | unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      if (status === 401 && exception.message.includes('Unauthorized')) {
        exceptionResponse = { message: 'Você não tem autorização para realizar essa ação.' };
      } else {
        exceptionResponse = exception.getResponse();
      }
    } else {
      exceptionResponse = { exception };
    }

    Sentry.setContext('request', {
      requestUrl: request.url,
      body: request.body,
      headers: request.headers,
    });

    Sentry.setTags({
      'statusCode': String(status),
      'X-Amzn-Trace-Id': request.headers['X-Amzn-Trace-Id'] as string,
    });

    if (status >= 500 && Sentry.getCurrentHub().getClient()) {
      Sentry.captureException(exception);

      await Sentry.flush(2000);
    }

    if (!this.env.isProduction) {
      if (!('toJSON' in Error.prototype))
        Object.defineProperty(Error.prototype, 'toJSON', {
          value() {
            const alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
              alt[key] = this[key];
            }, this);

            return alt;
          },
          configurable: true,
          writable: true,
        });
    }

    if (this.env.API_ENABLE_LOGGING)
      this.logger.error(exceptionResponse);

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(typeof exceptionResponse === 'object' && exceptionResponse),
      });
  }
}
