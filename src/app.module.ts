import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheController } from './shared/controllers/cache/cache.controller';
import { environment } from './environment/environment';
import { UserEntity } from './typeorm/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      logging: true,
      host: environment.db_host,
      port: environment.db_port,
      username: environment.db_username,
      password: environment.db_password,
      database: environment.db_name,
      entities: [
        UserEntity,
      ],
      synchronize: true,
      migrationsRun: true,
    }),
    JwtModule.register({
      secret: environment.jwt_secret,
      signOptions: { expiresIn: environment.jwt_expires_in },
    }),
    AuthModule,
    UserModule,
    PassportModule,
  ],
  controllers: [
    CacheController,
  ],
})
export class AppModule { }
