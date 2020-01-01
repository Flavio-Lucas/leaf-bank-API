import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../typeorm/entities/user.entity';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { ConfigModule } from '../config/config.module';
import { UserService } from '../users/services/user.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './controllers/local.strategy.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy.service';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
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
