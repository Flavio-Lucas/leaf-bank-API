import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokenModule } from './modules/auth-token/auth-token.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnvModule } from './modules/env/env.module';
import { TestModule } from './modules/test/test.module';
import { TypeOrmService } from './modules/typeorm/services/type-orm.service';
import { UserModule } from './modules/users/users.module';

const testModules = [];

if (process.env.NODE_ENV === 'test')
  testModules.push(TestModule);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    EnvModule,
    AuthModule,
    AuthTokenModule,
    UserModule,
    ...testModules,
  ],
  providers: [
    EnvModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule { }
