import { Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth/auth-token.module';
import { AuthModule } from '../auth/auth.module';
import { EnvModule } from '../env/env.module';
import { UserModule } from '../users/users.module';
import { FacebookController } from './controllers/facebook.controller';
import { FacebookService } from './services/facebook.service';
import { FacebookStrategy } from './strategies/facebook.strategy.service';

@Module({
  imports: [
    AuthTokenModule,
    UserModule,
    EnvModule,
    AuthModule,
  ],
  providers: [
    FacebookService,
    FacebookStrategy,
  ],
  controllers: [
    FacebookController,
  ],
  exports: [
    FacebookService,
  ],
})
export class FacebookModule {}
