import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionController } from './modules/transactions/newTransaction/create-transaction.controller';
import { SupabaseService } from './services/supabase.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { CreateTransactionUseCase } from './modules/transactions/newTransaction/create-transaction.use-case';
import databaseConfig from './config/database.config';
import { TransactionValidator } from './modules/transactions/newTransaction/validators/transaction.validator';
import { UserRepository } from './repositories/user.repository';
import { GetTransactionsByUserController } from './modules/transactions/getTransactionsByUser/get-transactions-by-user.controller';
import { GetTransactionsByUserUseCase } from './modules/transactions/getTransactionsByUser/get-transactions-by-user.use-case';
import { RejectTransactionUseCase } from './modules/transactions/rejectTransaction/reject-transaction.use-case';
import { ApproveTransactionUseCase } from './modules/transactions/approveTransaction/approve-transaction.use-case';
import { ApproveTransactionController } from './modules/transactions/approveTransaction/approve-transaction.controller';
import { RejectTransactionController } from './modules/transactions/rejectTransaction/reject-transaction.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
        }),
    ],
    controllers: [
        TransactionController,
        GetTransactionsByUserController,
        ApproveTransactionController,
        RejectTransactionController,
    ],
    providers: [
        SupabaseService,
        TransactionRepository,
        UserRepository,
        CreateTransactionUseCase,
        TransactionValidator,
        GetTransactionsByUserUseCase,
        ApproveTransactionUseCase,
        RejectTransactionUseCase,
    ],
})
export class AppModule { } 