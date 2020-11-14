"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// lambda.ts

const express = require('express');
const expressApp = express();

const SentryIntegrations = require('@sentry/integrations');
const SentryServerless = require('@sentry/serverless');
const SentryNode = require('@sentry/node');
const SentryTracing = require('@sentry/tracing');

const envalid = require('envalid');

const rule = {
  NODE_ENV: envalid.str({ default: '' }),
  SENTRY_DNS: envalid.str({ default: '' }),
};

const env = envalid.cleanEnv(process.env, rule, { dotEnvPath: '.env', strict: true, });

if (env.SENTRY_DNS) {
  expressApp.use(SentryNode.Handlers.requestHandler());
  expressApp.use(SentryNode.Handlers.tracingHandler());
  expressApp.use(SentryNode.Handlers.errorHandler());
  expressApp.use(SentryServerless.Handlers.requestHandler({ flushTimeout: 2000 }));

  SentryServerless.init({
    dsn: env.SENTRY_DNS,
    integrations: [
      new SentryNode.Integrations.Http({ tracing: true, breadcrumbs: true }),
      new SentryNode.Integrations.Console(),
      new SentryNode.Integrations.Modules(),
      new SentryNode.Integrations.FunctionToString(),
      new SentryNode.Integrations.OnUncaughtException(),
      new SentryNode.Integrations.OnUnhandledRejection(),
      new SentryTracing.Integrations.Express({ app: expressApp }),
      new SentryIntegrations.ReportingObserver(),
    ],
    tracesSampleRate: 1.0,
    debug: !env.isProduction,
    environment: env.NODE_ENV,
    maxBreadcrumbs: 100,
    attachStacktrace: true,
    maxValueLength: 1024,
  });
}

const nestjs = require("@nestjs/core");

const platformExpress = require("@nestjs/platform-express");
const awsServerless = require("aws-serverless-express");

const mainBase = require("./dist/main.base");
const appModule = require("./dist/app.module");

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this
// is likely due to a compressed response (e.g. gzip) which has not
// been handled correctly by aws-serverless-express and/or API
// Gateway. Add the necessary MIME types to binaryMimeTypes below
const binaryMimeTypes = [];

let cachedServer;

// Create the Nest.js server and convert it into an Express.js server
async function bootstrapServer() {
  if (!cachedServer) {
    let nestApp = await nestjs.NestFactory.create(appModule.AppModule, new platformExpress.ExpressAdapter(expressApp));

    nestApp = await mainBase.setup(nestApp);

    nestApp.enableCors({
      origin: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with, Accept',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    await nestApp.init();

    cachedServer = awsServerless.createServer(expressApp, undefined, binaryMimeTypes);
  }

  return cachedServer;
}

const awsHandler = async (event, context) => {
  cachedServer = await bootstrapServer();

  return awsServerless.proxy(cachedServer, event, context, 'PROMISE').promise;
};

exports.handler = awsHandler;
