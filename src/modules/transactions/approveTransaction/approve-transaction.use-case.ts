import { Injectable } from "@nestjs/common";
import { TransactionStatus } from "../../../models/transaction.model";
import { TransactionRepository } from "../../../repositories/transaction.repository";
import { TransactionStatusError, TransactionNotFoundError } from "../../../shared/errors/transaction.errors";

@Injectable()
export class ApproveTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transactionId: string) {
    const transaction = await this.transactionRepository.getTransactionById(transactionId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new TransactionStatusError(
        transactionId,
        transaction.status,
        TransactionStatus.PENDING
      );
    }

    try {
      await this.transactionRepository.transferMoney(
        transaction.origin_user_id,
        transaction.destiny_user_id,
        transaction.amount,
        transaction.id
      );
    } catch (error) {
      throw error;
    }
  }
}   