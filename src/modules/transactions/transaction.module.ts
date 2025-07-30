import { Module } from '@nestjs/common';
import { TransactionController } from './newTransaction/create-transaction.controller';
import { CreateTransactionUseCase } from './newTransaction/create-transaction.use-case';
import { TransactionValidator } from './newTransaction/validators/transaction.validator';
import { RepositoriesModule } from '../repositories/repositories.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    RepositoriesModule,
    DatabaseModule
  ],
  controllers: [
    TransactionController
  ],
  providers: [
    CreateTransactionUseCase,
    TransactionValidator
  ],
})
export class TransactionModule { } 