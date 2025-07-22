import { Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus } from '../../../models/transaction.model';
import { TransactionRepository } from '../../../repositories/transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionValidator } from './validators/transaction.validator';

@Injectable()
export class CreateTransactionUseCase {
  private readonly HIGH_AMOUNT_THRESHOLD = 50000;

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionValidator: TransactionValidator
  ) {}

  async execute(transaction: CreateTransactionDto): Promise<Transaction> {
    try {
      await this.transactionValidator.validateTransaction(transaction);
      const createTransaction = await this.transactionRepository.createTransaction(transaction);

      if (transaction.amount > this.HIGH_AMOUNT_THRESHOLD) {
        return await this.transactionRepository.updateTransactionStatus(
          createTransaction.id,
          TransactionStatus.PENDING
        );
      }

      try {
        await this.transactionRepository.transferMoney(
          transaction.originUserId,
          transaction.destinyUserId,
          transaction.amount,
          createTransaction.id
        );

        return await this.transactionRepository.updateTransactionStatus(
          createTransaction.id,
          TransactionStatus.COMPLETED
        );
      } catch (error) {
        await this.transactionRepository.updateTransactionStatus(
          createTransaction.id,
          TransactionStatus.FAILED
        );
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }
} 