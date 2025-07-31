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
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === 'admin') {
      return true;
    }

    const originAccountId = request.body.originAccountId;

    if (!originAccountId) {
      throw new ForbiddenException('Origin account ID is required');
    }

    const account = await this.accountRepository.findOne({
      where: { id: originAccountId },
      relations: ['client']
    });

    if (!account) {
      throw new ForbiddenException('Origin account not found');
    }

    if (account.clientId !== user.clientId) {
      throw new ForbiddenException('You can only create transactions from your own accounts');
    }

    return true;
  }
} 