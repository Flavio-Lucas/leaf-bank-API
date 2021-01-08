import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokenModule } from '../auth/auth-token.module';
import { EnvModule } from '../env/env.module';
import { MailModule } from '../mail/mail.module';
import { UserPasswordResetController } from './controllers/user-password-reset.controller';
import { UserPasswordResetEntity } from './entities/user-password-reset.entity';
import { UserPasswordResetService } from './services/user-password-reset.service';

@Module({
  imports: [
    AuthTokenModule,
    TypeOrmModule.forFeature([
      UserPasswordResetEntity,
    ]),
    MailModule,
    EnvModule,
  ],
  exports: [
    UserPasswordResetService,
  ],
  providers: [
    UserPasswordResetService,
  ],
  controllers: [
    UserPasswordResetController,
  ],
})
export class UserPasswordResetModule {}
