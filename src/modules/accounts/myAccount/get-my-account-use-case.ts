import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../entities/accounts';

@Injectable()
export class GetMyAccountUseCase {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async execute(clientId: string): Promise<Account> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    const account = await this.accountRepository.findOne({
      where: { clientId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  }
}
