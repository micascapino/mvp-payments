import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientAuth } from '../../../entities/clients';
import { Account } from '../../../entities/accounts';
import { CreateClientDto } from './dto/create-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @InjectRepository(ClientAuth)
    private clientRepository: Repository<ClientAuth>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async execute(clientData: CreateClientDto): Promise<ClientAuth> {
    try {
      // Verificar que el clientId no esté en uso
      const existingClient = await this.clientRepository.findOne({
        where: { clientId: clientData.clientId }
      });

      if (existingClient) {
        throw new Error('Client ID already in use');
      }

      // Verificar que la cuenta existe
      const account = await this.accountRepository.findOne({
        where: { email: clientData.email }
      });

      if (!account) {
        throw new Error('Account not found with the provided email');
      }

      // Verificar que la cuenta no tenga ya un cliente asociado
      const clientWithEmail = await this.clientRepository.findOne({
        where: { email: clientData.email }
      });

      if (clientWithEmail) {
        throw new Error('This account already has a client associated with it');
      }

      // Crear el cliente
      const hashedSecret = await bcrypt.hash(clientData.clientSecret, 10);
      
      const client = this.clientRepository.create({
        clientId: clientData.clientId,
        hashedSecret,
        email: clientData.email,
        role: clientData.role
      });

      return await this.clientRepository.save(client);
    } catch (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }
} 