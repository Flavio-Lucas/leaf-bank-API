import { Module } from '@nestjs/common';

import { UserModule } from '../users/users.module';
import { TestController } from './controllers/test.controller';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [
    TestController,
  ],
})
export class TestModule {}
