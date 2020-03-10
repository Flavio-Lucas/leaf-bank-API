//#region Imports

import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';
import * as timeout from 'connect-timeout';

import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { SentryFilter } from './filters/sentryFilter';
import { EnvService } from './modules/env/services/env.service';

const bodyParser = require('body-parser');

//#endregion

//#region Configurations

CrudConfigService.load({
  query: {
    limit: 100,
    cache: 2000,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  routes: {
    updateOneBase: {
      allowParamsOverride: true,
    },
    deleteOneBase: {
      returnDeleted: false,
    },
  },
});

//#endregion

//#region Setup Methods

/**
 * Método que configura o Swagger para a aplicação
 *
 * @param app A instância da aplicação
 * @param config As configurações da aplicação
 */
function setupSwagger(app: INestApplication, config: EnvService): void {
  if (!config.SWAGGER_ENABLED)
    return;

  const swaggerOptions = new DocumentBuilder()
    .setTitle(config.SWAGGER_TITLE)
    .setDescription(config.SWAGGER_DESCRIPTION)
    .setVersion(config.SWAGGER_VERSION)
    .addTag(config.SWAGGER_TAG)
    .setBasePath(config.API_BASE_PATH)
    .addBearerAuth('Authorization', 'header')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup(`${ config.API_BASE_PATH }/swagger`, app, document);
}

/**
 * Método que configura os pipes globais
 *
 * @param app A instância da aplicação
 */
function setupPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
}

/**
 * Método que configura os middleware da aplicação
 *
 * @param app A instância da aplicação
 */
function setupMiddleware(app: INestApplication): void {
  app.use(helmet());

  app.enableCors();

  app.use(bodyParser.json());

  app.use(timeout('30s'));

  app.use(haltOnTimeout);

  app.use(
    rateLimit({
      windowMs: 60_000, // 1 minute
      max: 40, // limit each IP to 100 requests per windowMs
    }),
  );
}

/**
 * Método que configura os filtros da aplicação
 *
 * @param app A instância da aplicação
 * @param config As configurações da aplicação
 */
function setupFilters(app: INestApplication, config: EnvService) {
  if (!config.SENTRY_DNS || config.isTest)
    return;

  Sentry.init({ dsn: config.SENTRY_DNS });

  app.useGlobalFilters(new SentryFilter());
}

/**
 * Mata a aplicação caso de timeout
 */
function haltOnTimeout(req, res, next) {
  if (req.timedout)
    throw new BadRequestException('A requisição durou tempo demais.');

  next();
}

//#endregion

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(EnvService);

  setupSwagger(app, config);
  setupPipes(app);
  setupMiddleware(app);
  setupFilters(app, config);

  app.setGlobalPrefix(config.API_BASE_PATH);

  return app;
}

export async function createAppInit(): Promise<INestApplication> {
  const app = await createApp();

  await app.init();

  return app;
}
