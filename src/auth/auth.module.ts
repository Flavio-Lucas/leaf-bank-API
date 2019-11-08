import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { environment } from '../environment/environment';
import { UserModule } from '../users/user.module';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './controllers/local.strategy.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  imports: [
    UserModule,
    JwtModule.register({
      secret: environment.jwt_secret,
      signOptions: { expiresIn: environment.jwt_expires_in },
    }),
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
