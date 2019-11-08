//#region Imports

import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';

import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as timeout from 'connect-timeout';

const bodyParser = require('body-parser');

import { clear, options } from 'apicache';

import { AppModule } from './app.module';
import { environment } from './environment/environment';

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

//#region Last Imports

//#endregion

//#region Setup Methods

/**
 * Método que configura o Swagger para a aplicação
 *
 * @param app A instância da aplicação
 */
function setupSwagger(app: INestApplication): void {
  const swaggerOptions = new DocumentBuilder()
    .setTitle(environment.swagger.title)
    .setDescription(environment.swagger.description)
    .setVersion(environment.swagger.basePath)
    .addTag(environment.swagger.tag)
    .setBasePath(environment.swagger.basePath)
    .addBearerAuth('Authorization', 'header')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  require('fs').writeFile('./swagger/swagger.json', JSON.stringify(document, null, 2), console.log);

  SwaggerModule.setup(`${environment.swagger.basePath}/swagger`, app, document);
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
 * Método que configura o cache
 *
 * @param app A instancia da aplicação
 */
function initCache(app: INestApplication): void {
  const isDevMode = process.env.NODE_ENV !== 'Production';

  const cache = options({
    debug: isDevMode,
    headers: {
      'cache-control': 'no-cache',
    },
    // @ts-ignore
    trackPerformance: isDevMode,
  }).middleware;

  const onlyStatus200 = (req, res) => {
    if (isDevMode)
      return false;

    const collection = req.path;

    if (collection.includes('cache'))
      return false;

    if (req.method !== 'GET') {
      clear(collection);

      return false;
    }

    req.apicacheGroup = collection;

    return res.statusCode === 200;
  };

  app.use(cache('10 minutes', onlyStatus200));
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

  setupSwagger(app);
  setupPipes(app);
  setupMiddleware(app);

  app.setGlobalPrefix(environment.swagger.basePath);

  return app;
}

export async function createAppInit(): Promise<INestApplication> {
  const app = await createApp();

  await app.init();

  return app;
}
