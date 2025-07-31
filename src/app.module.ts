import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './core/config/database.config';
import { DatabaseModule } from './database/database.module';
import { RepositoriesModule } from './core/repositories/repositories.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionModule } from './modules/transactions/transaction.module';

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
        TransactionModule,
    ],
})
export class AppModule { } 