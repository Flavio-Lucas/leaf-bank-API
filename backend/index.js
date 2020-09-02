"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// lambda.ts
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const aws_serverless_express_1 = require("aws-serverless-express");
const main_base_1 = require("./dist/main.base");
const app_module_1 = require("./dist/app.module");

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

    let nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));

    nestApp = await main_base_1.setup(nestApp);

    nestApp.enableCors({
      origin: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with, Accept',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    await nestApp.init();

    cachedServer = aws_serverless_express_1.createServer(expressApp, undefined, binaryMimeTypes);
  }

  return cachedServer;
}

// Export the handler : the entry point of the Lambda function
exports.handler = async (event, context) => {
  cachedServer = await bootstrapServer();

  return aws_serverless_express_1.proxy(cachedServer, event, context, 'PROMISE').promise;
};

//# sourceMappingURL=lambda.js.map
