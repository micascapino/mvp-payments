import { Injectable } from "@nestjs/common";
import { TransactionStatus } from "src/models/transaction.model";
import { TransactionRepository } from "src/repositories/transaction.repository";
import { TransactionStatusError } from "src/shared/errors/transaction.errors";

@Injectable()
export class RejectTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) { }

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
      await this.transactionRepository.updateTransactionStatus(transactionId, TransactionStatus.REJECTED);
    } catch (error) {
      throw error;
    }

  }
}   