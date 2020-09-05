"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;

const nestjsCore = require("@nestjs/core");
const platformExpress = require("@nestjs/platform-express");
const awsServerlessExpress = require("aws-serverless-express");
const mainBase = require("./dist/main.base");
const appModule = require("./dist/app.module");

const express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this
// is likely due to a compressed response (e.g. gzip) which has not
// been handled correctly by aws-serverless-express and/or API
// Gateway. Add the necessary MIME types to binaryMimeTypes below
const binaryMimeTypes = [];

let cachedServer;

// Create the Nest.js server and convert it into an Express.js server
async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();

    let nestApp = await nestjsCore.NestFactory.create(appModule.AppModule, new platformExpress.ExpressAdapter(expressApp));

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

    cachedServer = awsServerlessExpress.createServer(expressApp, undefined, binaryMimeTypes);
  }

  return cachedServer;
}

// Export the handler : the entry point of the Lambda function
exports.handler = async (event, context) => {
  cachedServer = await bootstrapServer();

  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE').promise;
};

