import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewAccountController } from './newAccount/new-account-controller';
import { CreateAccountUseCase } from './newAccount/new-account-use-case';
import { Account } from '../../entities/accounts';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [NewAccountController],
  providers: [CreateAccountUseCase],
  exports: [CreateAccountUseCase],
})
export class AccountsModule {} 