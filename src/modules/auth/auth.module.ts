import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../typeorm/entities/user.entity';
import { AuthTokenModule } from './auth-token.module';
import { UserService } from '../users/services/user.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AnonymousStrategyService } from './strategies/anonymous.strategy.service';
import { JwtStrategy } from './strategies/jwt.strategy.service';
import { LocalStrategy } from './strategies/local.strategy.service';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
    AnonymousStrategyService,
  ],
  controllers: [
    AuthController,
  ],
  imports: [
    AuthTokenModule,
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
