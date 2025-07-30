import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from "src/entities/accounts";

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async getAccountById(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    
    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  }

  async updateAccountBalance(id: string, newBalance: number): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    
    if (!account) {
      throw new Error('Account not found');
    }

    account.balance = newBalance;
    return await this.accountRepository.save(account);
  }
}