import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewAccountController } from './newAccount/new-account-controller';
import { CreateAccountUseCase } from './newAccount/new-account-use-case';
import { GetMyAccountController } from './myAccount/get-my-account-controller';
import { GetMyAccountUseCase } from './myAccount/get-my-account-use-case';
import { Account } from '../../entities/accounts';
import { ClientAuth } from '../../entities/clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, ClientAuth]),
  ],
  controllers: [NewAccountController, GetMyAccountController],
  providers: [CreateAccountUseCase, GetMyAccountUseCase],
  exports: [CreateAccountUseCase, GetMyAccountUseCase],
})
export class AccountsModule {} 