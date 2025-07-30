import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionController } from './modules/transactions/newTransaction/create-transaction.controller';
import { CreateTransactionUseCase } from './modules/transactions/newTransaction/create-transaction.use-case';
import databaseConfig from './config/database.config';
import { TransactionValidator } from './modules/transactions/newTransaction/validators/transaction.validator';
import { RejectTransactionUseCase } from './modules/transactions/rejectTransaction/reject-transaction.use-case';
import { ApproveTransactionUseCase } from './modules/transactions/approveTransaction/approve-transaction.use-case';
import { ApproveTransactionController } from './modules/transactions/approveTransaction/approve-transaction.controller';
import { RejectTransactionController } from './modules/transactions/rejectTransaction/reject-transaction.controller';
import { DatabaseModule } from './modules/database/database.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
        }),
        DatabaseModule,
        RepositoriesModule,
        AuthModule,
        AccountsModule,
    ],
    controllers: [
        TransactionController,
        ApproveTransactionController,
        RejectTransactionController,
    ],
    providers: [
        CreateTransactionUseCase,
        TransactionValidator,
        ApproveTransactionUseCase,
        RejectTransactionUseCase,
    ],
})
export class AppModule { } 