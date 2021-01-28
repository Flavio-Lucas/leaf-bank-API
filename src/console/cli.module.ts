import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { GenerateService } from './services/generate.service';
import { HelpService } from './services/help.service';

@Module({
  imports: [
    ConsoleModule,
  ],
  providers: [
    GenerateService,
    HelpService,
  ],
})
export class CLIModule {}
