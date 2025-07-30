import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../entities/accounts';
import { ClientAuth } from '../../../entities/clients';
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
      // Verificar que el email no esté en uso
      const existingAccount = await this.accountRepository.findOne({
        where: { email: accountData.email }
      });

      if (existingAccount) {
        throw new Error('Email already in use');
      }

      // Verificar si ya existe un cliente con este email
      const existingClient = await this.clientRepository.findOne({
        where: { email: accountData.email }
      });

      if (!existingClient) {
        console.log(`No se encontró un cliente con el email ${accountData.email}. La cuenta se creará sin vincular a un cliente.`);
      } else {
        console.log(`Cliente encontrado: ${existingClient.clientId}. Vinculando cuenta...`);
      }

      const account = this.accountRepository.create({
        name: accountData.name,
        email: accountData.email,
        balance: accountData.balance,
        clientId: existingClient?.clientId || null
      });

      return await this.accountRepository.save(account);
    } catch (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }
}
