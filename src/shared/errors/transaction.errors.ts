import { TransactionStatus } from '../../models/transaction.model';

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class TransactionStatusError extends TransactionError {
  constructor(
    transactionId: string,
    currentStatus: TransactionStatus,
    expectedStatus: TransactionStatus
  ) {
    super(`Transaction ${transactionId} is in ${currentStatus} status. Expected status: ${expectedStatus}`);
    this.name = 'TransactionStatusError';
  }
}

export class TransactionNotFoundError extends TransactionError {
  constructor(transactionId: string) {
    super(`Transaction ${transactionId} not found`);
    this.name = 'TransactionNotFoundError';
  }
}

export class TransactionAmountError extends TransactionError {
  constructor(transactionId: string, amount: number, threshold: number) {
    super(`Transaction ${transactionId} amount (${amount}) exceeds threshold (${threshold})`);
    this.name = 'TransactionAmountError';
  }
}

export class TransactionBalanceError extends TransactionError {
  constructor(userId: number, currentBalance: number, requiredAmount: number) {
    super(`User ${userId} has insufficient balance. Current: ${currentBalance}, Required: ${requiredAmount}`);
    this.name = 'TransactionBalanceError';
  }
} 