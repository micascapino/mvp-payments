import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../core/entities/accounts';
import { ClientAuth } from '../../../core/entities/clients';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(ClientAuth)
    private clientRepository: Repository<ClientAuth>
  ) {}

  async execute(accountData: CreateAccountDto): Promise<Account> {
    try {
      const existingAccount = await this.accountRepository.findOne({
        where: { email: accountData.email }
      });

      if (existingAccount) {
        throw new Error('Email already in use');
      }

      const newAccount = this.accountRepository.create({
        name: accountData.name,
        email: accountData.email,
        balance: accountData.balance,
      });

      if (accountData.email) {
        const existingClient = await this.clientRepository.findOne({
          where: { email: accountData.email }
        });

        if (!existingClient) {
          console.log(`No client found with email ${accountData.email}. Account will be created without linking to a client.`);
        } else {
          newAccount.clientId = existingClient.clientId;
        }
      }

      return await this.accountRepository.save(newAccount);
    } catch (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }
}
