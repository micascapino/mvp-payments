import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { AccountRepository } from '../../repositories/account.repository';
import { Transaction } from '../../entities/transactions';
import { Account } from '../../entities/accounts';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  providers: [TransactionRepository, AccountRepository],
  exports: [TransactionRepository, AccountRepository],
})
export class RepositoriesModule {} 