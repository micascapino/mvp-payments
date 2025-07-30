import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTransactionDto } from '../modules/transactions/newTransaction/dto/create-transaction.dto';
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
    newTransaction.amount = transaction.amount;
    newTransaction.status = TransactionStatus.PENDING;

    return await this.transactionRepository.save(newTransaction);
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new Error('Transacción no encontrada');
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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const originAccount = await queryRunner.manager
        .createQueryBuilder(Account, 'account')
        .setLock('pessimistic_write')
        .where('account.id = :id', { id: originAccountId })
        .getOne();

      if (!originAccount) {
        throw new Error('Origin account not found');
      }

      if (originAccount.balance < amount) {
        throw new Error('Insufficient funds in origin account');
      }

      const destinyAccount = await queryRunner.manager
        .createQueryBuilder(Account, 'account')
        .setLock('pessimistic_write')
        .where('account.id = :id', { id: destinyAccountId })
        .getOne();

      if (!destinyAccount) {
        throw new Error('Destiny account not found');
      }

      originAccount.balance -= amount;
      destinyAccount.balance += amount;

      await queryRunner.manager.save(Account, originAccount);
      await queryRunner.manager.save(Account, destinyAccount);

      const transaction = await queryRunner.manager
        .createQueryBuilder(Transaction, 'transaction')
        .setLock('pessimistic_write')
        .where('transaction.id = :id', { id: transactionId })
        .getOne();

      if (transaction) {
        transaction.status = TransactionStatus.COMPLETED;
        await queryRunner.manager.save(Transaction, transaction);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
      if (transaction) {
        transaction.status = TransactionStatus.FAILED;
        await this.transactionRepository.save(transaction);
      }

      throw new Error(`Transfer failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactionsByUser(userId: string) {
    return await this.transactionRepository.find({
      where: [
        { originAccountId: userId },
        { destinyAccountId: userId }
      ],
      order: { createdAt: 'ASC' }
    });
  }

  async getTransactionById(transactionId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    return transaction;
  }
} 