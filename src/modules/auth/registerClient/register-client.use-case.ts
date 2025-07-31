import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientAuth, ClientRole } from '../../../core/entities/clients';
import { RegisterClientDto } from './dto/register-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterClientUseCase {
  constructor(
    @InjectRepository(ClientAuth)
    private clientRepository: Repository<ClientAuth>
  ) {}

  async execute(registerData: RegisterClientDto): Promise<{ clientId: string; email: string }> {
    // Verificar si ya existe un cliente con ese ID o email
    const existingClient = await this.clientRepository.findOne({
      where: [
        { clientId: registerData.clientId },
        { email: registerData.email }
      ]
    });

    if (existingClient) {
      throw new ConflictException(
        existingClient.clientId === registerData.clientId
          ? 'Client ID already in use'
          : 'Email already in use'
      );
    }

    // Hash del secreto
    const hashedSecret = await bcrypt.hash(registerData.clientSecret, 10);

    // Crear el cliente
    const client = this.clientRepository.create({
      clientId: registerData.clientId,
      hashedSecret,
      email: registerData.email,
      isActive: true
    });

    await this.clientRepository.save(client);

    return {
      clientId: client.clientId,
      email: client.email
    };
  }
} 