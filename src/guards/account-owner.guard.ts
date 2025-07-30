import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/accounts';
import { ClientAuth } from '../entities/clients';

@Injectable()
export class AccountOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(ClientAuth)
    private clientRepository: Repository<ClientAuth>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Admin puede acceder a cualquier cuenta
    if (user.role === 'admin') {
      return true;
    }

    // Obtener el ID de cuenta del cuerpo de la solicitud o de los parámetros
    const accountId = request.body.accountId || request.params.accountId;
    
    if (!accountId) {
      return true; // Si no hay ID de cuenta, no podemos validar
    }

    // Buscar el cliente autenticado para obtener el email asociado
    const client = await this.clientRepository.findOne({
      where: { clientId: user.clientId }
    });

    if (!client || !client.email) {
      throw new ForbiddenException('Client not associated with any email');
    }

    // Buscar la cuenta y verificar que pertenezca al usuario
    const account = await this.accountRepository.findOne({
      where: { id: accountId }
    });

    if (!account) {
      throw new ForbiddenException('Account not found');
    }

    // Verificar que la cuenta pertenezca al usuario
    if (account.email !== client.email) {
      throw new ForbiddenException('You can only access your own accounts');
    }

    return true;
  }
} 