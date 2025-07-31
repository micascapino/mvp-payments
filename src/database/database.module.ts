import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../core/config/typeorm.config';
import { Transaction } from '../core/entities/transactions';
import { ClientAuth } from '../core/entities/clients';
import { Account } from '../core/entities/accounts';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Transaction, ClientAuth, Account]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {} 