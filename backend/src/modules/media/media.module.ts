import { Module } from '@nestjs/common';

import { AuthTokenModule } from '../auth/auth-token.module';
import { AzureModule } from '../azure/azure-nest-storage.module';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/services/env.service';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  imports: [
    AuthTokenModule,
    AzureModule.withConfigAsync({
      inject: [EnvService],
      imports: [EnvModule],
      useFactory: envService => ({
        sasKey: envService.AZURE_SAS_KEY,
        accountName: envService.AZURE_ACCOUNT_NAME,
        containerName: envService.AZURE_CONTAINER_NAME,
      }),
    }),
  ],
  exports: [
    MediaService,
  ],
  providers: [
    MediaService,
  ],
  controllers: [
    MediaController,
  ],
})
export class MediaModule {}
