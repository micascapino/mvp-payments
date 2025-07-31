import { Injectable } from '@nestjs/common';
import { Transaction } from '../../../core/entities/transactions';
import { TransactionRepository } from '../../../core/repositories/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../core/entities/accounts';
import { TransactionFilterDto } from './dto/transaction-filter.dto';

@Injectable()
export class GetMyTransactionsUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) { }

  async execute(clientId: string, filters?: TransactionFilterDto): Promise<Transaction[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    const account = await this.accountRepository.findOne({
      where: { clientId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const filtersWithDates = {
      ...filters,
      startDate: filters?.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate) : undefined
    };

    const transactions = await this.transactionRepository.getTransactionsByUser(account.id, filtersWithDates);

    if (!transactions || transactions.length === 0) {
      throw new Error('No transactions found');
    }

    return transactions;
  }
} 