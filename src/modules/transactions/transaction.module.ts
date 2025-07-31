import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './newTransaction/create-transaction.controller';
import { CreateTransactionUseCase } from './newTransaction/create-transaction.use-case';
import { GetMyTransactionsController } from './getMyTransactions/get-my-transactions-controller';
import { GetMyTransactionsUseCase } from './getMyTransactions/get-my-transactions-use-case';
import { TransactionValidator } from './newTransaction/validators/transaction.validator';
import { RepositoriesModule } from '../../core/repositories/repositories.module';
import { DatabaseModule } from '../../database/database.module';
import { Account } from '../../core/entities/accounts';
import { Transaction } from '../../core/entities/transactions';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Transaction]),
    RepositoriesModule,
    DatabaseModule
  ],
  controllers: [
    TransactionController,
    GetMyTransactionsController
  ],
  providers: [
    CreateTransactionUseCase,
    GetMyTransactionsUseCase,
    TransactionValidator
  ],
})
export class TransactionModule { } 