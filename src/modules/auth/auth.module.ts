import { Module } from '@nestjs/common';

import { UserModule } from '../users/users.module';
import { AuthTokenModule } from './auth-token.module';
import { AuthController } from './controllers/auth.controller';
import { AnonymousStrategyService } from './services/anonymous.strategy.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy.service';
import { LocalStrategy } from './services/local.strategy.service';
import { RefreshJwtStrategy } from './services/refresh-jwt.strategy.service';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AnonymousStrategyService,
    RefreshJwtStrategy,
  ],
  controllers: [
    AuthController,
  ],
  imports: [
    AuthTokenModule,
    UserModule,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
