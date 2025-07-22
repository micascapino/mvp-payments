import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../repositories/user.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async validateTransaction(transaction: CreateTransactionDto): Promise<void> {
    await this.validateOriginUser(transaction);
    await this.validateDestinyUser(transaction);
  }

  private async validateOriginUser(transaction: CreateTransactionDto): Promise<void> {
    const originUser = await this.userRepository.getUserById(transaction.originUserId);
    
    if (!originUser) {
      throw new Error('Origin user not found');
    }

    if (originUser.balance < transaction.amount) {
      throw new Error('Insufficient balance');
    }
  }

  private async validateDestinyUser(transaction: CreateTransactionDto): Promise<void> {
    const destinyUser = await this.userRepository.getUserById(transaction.destinyUserId);
    
    if (!destinyUser) {
      throw new Error('Destiny user not found');
    }
  }
} 