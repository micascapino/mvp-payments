import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../entities/accounts';
import { ClientAuth } from '../../entities/clients';

@Injectable()
export class TransactionOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(ClientAuth)
    private clientRepository: Repository<ClientAuth>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Admin puede crear cualquier transacción
    if (user.role === 'admin') {
      return true;
    }

    // Obtener el ID de cuenta origen de la transacción
    const originAccountId = request.body.originAccountId;
    
    if (!originAccountId) {
      throw new ForbiddenException('Origin account ID is required');
    }

    // Buscar el cliente autenticado para obtener el email asociado
    const client = await this.clientRepository.findOne({
      where: { clientId: user.clientId }
    });

    if (!client || !client.email) {
      throw new ForbiddenException('Client not associated with any email');
    }

    // Buscar la cuenta origen y verificar que pertenezca al usuario
    const account = await this.accountRepository.findOne({
      where: { id: originAccountId }
    });

    if (!account) {
      throw new ForbiddenException('Origin account not found');
    }

    // Verificar que la cuenta origen pertenezca al usuario
    if (account.email !== client.email) {
      throw new ForbiddenException('You can only create transactions from your own accounts');
    }

    return true;
  }
} 