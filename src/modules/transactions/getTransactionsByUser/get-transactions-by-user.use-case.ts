import { Injectable } from "@nestjs/common";

import { TransactionRepository } from "src/repositories/transaction.repository";

@Injectable()
export class GetTransactionsByUserUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: string) {
    return this.transactionRepository.getTransactionsByUser(userId);
  }
}
    