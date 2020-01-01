import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../typeorm/entities/user.entity';

import { UserSubscriber } from '../../typeorm/subscribers/user.subscriber';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserSubscriber,
  ],
  imports: [
    AuthTokenModule,
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  exports: [
    UserService,
  ],
})
export class UserModule { }
