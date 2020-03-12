import { HttpModule, Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth-token/auth-token.module';
import { AuthModule } from '../auth/auth.module';
import { HttpAsyncModule } from '../http-async/http-async.module';
import { UserModule } from '../users/users.module';
import { FacensController } from './controllers/facens.controller';
import { FacensService } from './services/facens.service';
import { FacensStrategy } from './strategies/facens.strategy';

@Module({
  controllers: [
    FacensController,
  ],
  imports: [
    AuthTokenModule,
    HttpAsyncModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    FacensService,
    FacensStrategy,
  ],
  exports: [
    FacensService,
    FacensStrategy,
  ],
})
export class FacensModule {}
