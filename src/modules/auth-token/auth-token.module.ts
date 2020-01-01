import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services/config.service';

@Module({
  imports: [
    PassportModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        defaultStrategy: config.API_DEFAULT_STRATEGY,
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.JWT_SECRET_KEY,
      }),
    }),
  ],
  exports: [
    PassportModule,
    JwtModule,
  ],
})
export class AuthTokenModule { }
