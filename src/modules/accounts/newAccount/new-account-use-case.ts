import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../entities/accounts';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async execute(accountData: CreateAccountDto): Promise<Account> {
    try {
      // Verificar que el email no esté en uso
      const existingAccount = await this.accountRepository.findOne({
        where: { email: accountData.email }
      });

      if (existingAccount) {
        throw new Error('Email already in use');
      }

      const account = this.accountRepository.create({
        name: accountData.name,
        email: accountData.email,
        balance: accountData.balance
      });

      return await this.accountRepository.save(account);
    } catch (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }
}
