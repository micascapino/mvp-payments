import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { AccountRepository } from '../../../../core/repositories/account.repository';

@Injectable()
export class TransactionValidator {
  constructor(private readonly accountRepository: AccountRepository) {}

  async validateTransaction(transaction: CreateTransactionDto): Promise<void> {
    await this.validateOriginUser(transaction);
    await this.validateDestinyUser(transaction);
  }

  private async validateOriginUser(transaction: CreateTransactionDto): Promise<void> {
    const originUser = await this.accountRepository.getAccountById(transaction.originAccountId);
    
    if (!originUser) {
      throw new Error('Origin user not found');
    }

    if (originUser.balance < transaction.amount) {
      throw new Error('Insufficient balance');
    }
  }

  private async validateDestinyUser(transaction: CreateTransactionDto): Promise<void> {
    const destinyUser = await this.accountRepository.getAccountById(transaction.destinyAccountId);
    
    if (!destinyUser) {
      throw new Error('Destiny user not found');
    }
  }
} 