import {Global, Module} from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { MailService } from './services/mail.service';

@Global()
@Module({
    imports: [
        EnvModule,
    ],
    providers: [
        MailService,
    ],
    exports: [
        MailService,
    ],
})
export class MailModule {}
