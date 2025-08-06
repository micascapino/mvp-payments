import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateTransactionDto } from '../../modules/transactions/newTransaction/dto/create-transaction.dto';
import { Account } from '../entities/accounts';
import { Transaction, TransactionStatus } from '../entities/transactions';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource
  ) { }

  async createTransaction(transaction: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = new Transaction();
    newTransaction.originAccountId = transaction.originAccountId;
    newTransaction.destinyAccountId = transaction.destinyAccountId;
    newTransaction.amount = Number(transaction.amount.toFixed(2));
    newTransaction.status = TransactionStatus.PENDING;

    return await this.transactionRepository.save(newTransaction);
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = status;
    return await this.transactionRepository.save(transaction);
  }

  async transferMoney(
    originAccountId: string,
    destinyAccountId: string,
    amount: number,
    transactionId: string
  ): Promise<void> {

    const existingTransaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
    if (existingTransaction.status === TransactionStatus.COMPLETED || existingTransaction.status === TransactionStatus.FAILED) {
      return;
    }
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [originAccount, destinyAccount] = await Promise.all([
        queryRunner.manager
          .createQueryBuilder(Account, 'account')
          .setLock('pessimistic_write')
          .where('account.id = :id', { id: originAccountId })
          .getOne(),
        queryRunner.manager
          .createQueryBuilder(Account, 'account')
          .setLock('pessimistic_write')
          .where('account.id = :id', { id: destinyAccountId })
          .getOne()
      ]);

      if (!originAccount) {
        throw new Error('Origin account not found');
      }

      if (!destinyAccount) {
        throw new Error('Destiny account not found');
      }

      if (originAccount.balance < amount) {
        throw new Error('Insufficient funds in origin account');
      }

      const amountToTransfer = Number(amount.toFixed(2));
      originAccount.balance = Number((originAccount.balance - amountToTransfer).toFixed(2));
      destinyAccount.balance = Number((destinyAccount.balance + amountToTransfer).toFixed(2));

      await Promise.all([
        queryRunner.manager.save(Account, originAccount),
        queryRunner.manager.save(Account, destinyAccount),
        this.updateTransactionStatusInTransaction(queryRunner, transactionId, TransactionStatus.COMPLETED)
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      await this.updateTransactionStatusInTransaction(queryRunner, transactionId, TransactionStatus.FAILED);

      throw new Error(`Transfer failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactionsByUser(userId: string, filters?: {
    status?: string,
    destinyAccountId?: string,
    startDate?: Date,
    endDate?: Date
  }) {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .where('(transaction.originAccountId = :userId OR transaction.destinyAccountId = :userId)',
        { userId });

    if (filters?.status) {
      queryBuilder.andWhere('transaction.status = :status', { status: filters.status });
    }

    if (filters?.destinyAccountId) {
      queryBuilder.andWhere('transaction.destinyAccountId = :destinyId',
        { destinyId: filters.destinyAccountId });
    }

    if (filters?.startDate) {
      queryBuilder.andWhere('transaction.createdAt >= :startDate',
        { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      queryBuilder.andWhere('transaction.createdAt <= :endDate',
        { endDate: filters.endDate });
    }

    queryBuilder.orderBy('transaction.createdAt', 'ASC');

    return await queryBuilder.getMany();
  }

  async getTransactionById(transactionId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  private async updateTransactionStatusInTransaction(
    queryRunner: QueryRunner,
    transactionId: string,
    status: TransactionStatus
  ): Promise<void> {
    const transaction = await queryRunner.manager
      .createQueryBuilder(Transaction, 'transaction')
      .setLock('pessimistic_write')
      .where('transaction.id = :id', { id: transactionId })
      .getOne();

    if (transaction) {
      transaction.status = status;
      await queryRunner.manager.save(Transaction, transaction);
    }
  }

} 