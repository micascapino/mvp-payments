import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import { Transaction } from '../../entities/transactions';
import { ClientAuth } from '../../entities/clients';
import { Account } from '../../entities/accounts';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Transaction, ClientAuth, Account]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {} 