import { Injectable } from '@nestjs/common';
import { Transaction } from '../../../core/entities/transactions';
import { TransactionRepository } from '../../../core/repositories/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../core/entities/accounts';

@Injectable()
export class GetMyTransactionsUseCase {
    constructor(
        private transactionRepository: TransactionRepository,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>
    ) { }

    async execute(clientId: string): Promise<Transaction[]> {
        if (!clientId) {
            throw new Error('Client ID is required');
        }

        const account = await this.accountRepository.findOne({
            where: { clientId }
        });

        const transactions = await this.transactionRepository.getTransactionsByUser(account.id);

        if (!transactions) {
            throw new Error('No transactions found');
        }

        return transactions;
    }
} 