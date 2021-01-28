import { HttpModule, Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/services/env.service';
import { HttpAsyncService } from './services/http-async.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [EnvModule],
      useFactory: async (env: EnvService) => ({
        timeout: env.HTTP_TIMEOUT,
        maxRedirects: env.HTTP_MAX_REDIRECTS,
        baseURL: env.HTTP_BASE_URL,
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    HttpAsyncService,
  ],
  exports: [
    HttpAsyncService,
  ],
})
export class HttpAsyncModule {}
