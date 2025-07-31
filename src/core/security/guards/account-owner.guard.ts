import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../entities/accounts';
import { ClientAuth } from '../../entities/clients';

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
    
    if (user.role === 'admin') {
      return true;
    }

    const accountId = request.body.accountId || request.params.accountId;
    
    if (!accountId) {
      return true;
    }

    const client = await this.clientRepository.findOne({
      where: { clientId: user.clientId }
    });

    if (!client || !client.email) {
      throw new ForbiddenException('Client not associated with any email');
    }
    const account = await this.accountRepository.findOne({
      where: { id: accountId }
    });

    if (!account) {
      throw new ForbiddenException('Account not found');
    }

    if (account.email !== client.email) {
      throw new ForbiddenException('You can only access your own accounts');
    }

    return true;
  }
} 