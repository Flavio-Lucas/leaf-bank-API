import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionEntity } from './entities/transaction.entity';
import { AuthTokenModule } from '../auth/auth-token.module';

@Module({
  imports: [
    AuthTokenModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
    ]),
  ],
  exports: [
    TransactionService,
  ],
  providers: [
    TransactionService,
  ],
  controllers: [
    TransactionController,
  ],
})
export class TransactionModule {}
