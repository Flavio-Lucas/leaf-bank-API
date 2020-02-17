import { Module, Global } from '@nestjs/common';

import { EnvService } from './services/env.service';

const envFieldName = '.env';

export const envConfig = new EnvService(envFieldName);

@Global()
@Module({
  providers: [
    { provide: EnvService, useValue: new EnvService(envFieldName) },
  ],
  exports: [
    EnvService,
  ],
})
export class EnvModule { }
