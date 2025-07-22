import { Module } from '@nestjs/common';
import { TransactionController } from './newTransaction/create-transaction.controller';
import { CreateTransactionUseCase } from './newTransaction/create-transaction.use-case';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { UserRepository } from '../../repositories/user.repository';
import { TransactionValidator } from './newTransaction/validators/transaction.validator';

@Module({
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    TransactionRepository,
    UserRepository,
    TransactionValidator
  ],
})
export class TransactionModule {} 