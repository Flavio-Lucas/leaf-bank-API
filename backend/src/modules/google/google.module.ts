import { Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth/auth-token.module';
import { AuthModule } from '../auth/auth.module';
import { EnvModule } from '../env/env.module';
import { UserModule } from '../users/users.module';
import { GoogleController } from './controllers/google.controller';
import { GoogleService } from './services/google.service';

@Module({
  imports: [
    AuthTokenModule,
    UserModule,
    EnvModule,
    AuthModule,
  ],
  providers: [
    GoogleService,
  ],
  controllers: [
    GoogleController,
  ],
  exports: [
    GoogleService,
  ],
})
export class GoogleModule {}
