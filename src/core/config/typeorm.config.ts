import { DataSource, DataSourceOptions } from 'typeorm';
import { Transaction } from '../entities/transactions';
import { ClientAuth } from '../entities/clients';
import { Account } from '../entities/accounts';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mvp_payments',
  entities: [Transaction, ClientAuth, Account],
  synchronize: false,
};

export default new DataSource(typeOrmConfig); 