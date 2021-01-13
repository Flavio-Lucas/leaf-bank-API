"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// lambda.ts

const express = require('express');
const expressApp = express();

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
