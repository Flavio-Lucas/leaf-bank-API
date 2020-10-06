import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthTokenModule} from '../auth/auth-token.module';
import {UserPasswordResetEntity} from './entities/user-password-reset.entity';
import {UserPasswordResetService} from './services/user-password-reset.service';
import {UserPasswordResetController} from './controllers/user-password-reset.controller';
import {UserModule} from '../users/users.module';
import {MailModule} from '../mail/mail.module';
import {EnvModule} from '../env/env.module';

@Module({
    imports: [
        AuthTokenModule,
        TypeOrmModule.forFeature([
            UserPasswordResetEntity,
        ]),
        UserModule,
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
export class UserPasswordResetModule {
}
