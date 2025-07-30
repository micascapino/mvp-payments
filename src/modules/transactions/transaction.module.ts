import { Module } from '@nestjs/common';
import { TransactionController } from './newTransaction/create-transaction.controller';
import { CreateTransactionUseCase } from './newTransaction/create-transaction.use-case';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { AccountRepository } from '../../repositories/account.repository';
import { TransactionValidator } from './newTransaction/validators/transaction.validator';

@Module({
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    TransactionRepository,
    AccountRepository,
    TransactionValidator
  ],
})
export class TransactionModule {} 