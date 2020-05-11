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
    alwaysPaginate: true,
    maxLimit: 250,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  routes: {
    exclude: ['replaceOneBase'],
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
 * @param env As configurações da aplicação
 */
function setupSwagger(app: INestApplication, env: EnvService): void {
  if (!env.SWAGGER_ENABLED)
    return;

  const swaggerOptions = new DocumentBuilder()
    .setTitle(env.SWAGGER_TITLE)
    .setDescription(env.SWAGGER_DESCRIPTION)
    .setVersion(env.SWAGGER_VERSION)
    .addTag(env.SWAGGER_TAG)
    .setBasePath(env.API_BASE_PATH)
    .addBearerAuth('Authorization', 'header')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup(`${ env.API_BASE_PATH }/swagger`, app, document);
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
 * @param env As configurações da aplicação
 */
function setupMiddleware(app: INestApplication, env: EnvService): void {
  app.use(helmet());

  app.enableCors();

  app.use(bodyParser.json());

  app.use(timeout('30s'));

  app.use(haltOnTimeout);

  if (env.isTest)
    return;

  app.use(
    rateLimit({
      windowMs: env.API_RATE_LIMIT_WINDOW_MS, // 1 minute
      max: env.API_RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
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
  app.useGlobalFilters(new SentryFilter(config));

  if (!config.SENTRY_DNS || config.isTest)
    return;

  Sentry.init({ dsn: config.SENTRY_DNS });
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

  await setup(app);

  return app;
}

export async function setup(app: INestApplication): Promise<INestApplication> {
  const env = await app.get(EnvService);

  setupSwagger(app, env);
  setupPipes(app);
  setupMiddleware(app, env);
  setupFilters(app, env);

  app.setGlobalPrefix(env.API_BASE_PATH);

  return app;
}


export async function createAppInit(): Promise<INestApplication> {
  const app = await createApp();

  await app.init();

  return app;
}
