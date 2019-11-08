import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../typeorm/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserSubscriber } from '../typeorm/subscribers/user.subscriber';

@Module({
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserSubscriber,
  ],
  exports: [
    UserService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
})
export class UserModule {}
