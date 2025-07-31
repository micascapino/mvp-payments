import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from './account.repository';
import { Transaction } from '../entities/transactions';
import { Account } from '../entities/accounts';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  providers: [TransactionRepository, AccountRepository],
  exports: [TransactionRepository, AccountRepository],
})
export class RepositoriesModule {} 