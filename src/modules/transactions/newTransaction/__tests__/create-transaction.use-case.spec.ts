import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../create-transaction.use-case';
import { TransactionRepository } from '../../../../repositories/transaction.repository';
import { TransactionValidator } from '../validators/transaction.validator';
import { TransactionStatus } from '../../../../models/transaction.model';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let transactionValidator: jest.Mocked<TransactionValidator>;

  const mockTransaction: CreateTransactionDto = {
    originUserId: 1,
    destinyUserId: 2,
    amount: 1000,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockTransactionRepository = {
      createTransaction: jest.fn(),
      updateTransactionStatus: jest.fn(),
      transferMoney: jest.fn(),
    };

    const mockTransactionValidator = {
      validateTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
        {
          provide: TransactionValidator,
          useValue: mockTransactionValidator,
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    transactionRepository = module.get(TransactionRepository);
    transactionValidator = module.get(TransactionValidator);
  });

  describe('execute', () => {
    it('should create a successful transaction when amount is below threshold', async () => {
      const createdTransaction = { 
        id: '1', 
        originUserId: mockTransaction.originUserId,
        destinyUserId: mockTransaction.destinyUserId,
        amount: mockTransaction.amount,
        status: TransactionStatus.PENDING,
        createdAt: new Date()
      };
      const completedTransaction = { 
        ...createdTransaction, 
        status: TransactionStatus.COMPLETED
      };

      transactionRepository.createTransaction.mockResolvedValue(createdTransaction);
      transactionRepository.transferMoney.mockResolvedValue(undefined);
      transactionRepository.updateTransactionStatus.mockResolvedValue(completedTransaction);

      const result = await useCase.execute(mockTransaction);

      expect(transactionValidator.validateTransaction).toHaveBeenCalledTimes(1);
      expect(transactionValidator.validateTransaction).toHaveBeenCalledWith(mockTransaction);
      
      expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(mockTransaction);
      
      expect(transactionRepository.transferMoney).toHaveBeenCalledTimes(1);
      expect(transactionRepository.transferMoney).toHaveBeenCalledWith(
        mockTransaction.originUserId,
        mockTransaction.destinyUserId,
        mockTransaction.amount,
        createdTransaction.id
      );
      
      expect(transactionRepository.updateTransactionStatus).toHaveBeenCalledTimes(1);
      expect(transactionRepository.updateTransactionStatus).toHaveBeenCalledWith(
        createdTransaction.id,
        TransactionStatus.COMPLETED
      );
      
      expect(result).toEqual(completedTransaction);
      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should create a pending transaction when amount exceeds threshold', async () => {
      const highAmountTransaction: CreateTransactionDto = {
        ...mockTransaction,
        amount: 60000,
      };

      const createdTransaction = { 
        id: '1', 
        originUserId: highAmountTransaction.originUserId,
        destinyUserId: highAmountTransaction.destinyUserId,
        amount: highAmountTransaction.amount,
        status: TransactionStatus.PENDING,
        createdAt: new Date()
      };
      const pendingTransaction = { 
        ...createdTransaction, 
        status: TransactionStatus.PENDING
      };

      transactionRepository.createTransaction.mockResolvedValue(createdTransaction);
      transactionRepository.updateTransactionStatus.mockResolvedValue(pendingTransaction);

      const result = await useCase.execute(highAmountTransaction);

      expect(transactionValidator.validateTransaction).toHaveBeenCalledTimes(1);
      expect(transactionValidator.validateTransaction).toHaveBeenCalledWith(highAmountTransaction);
      
      expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(highAmountTransaction);
      
      expect(transactionRepository.transferMoney).not.toHaveBeenCalled();
      
      expect(transactionRepository.updateTransactionStatus).toHaveBeenCalledTimes(1);
      expect(transactionRepository.updateTransactionStatus).toHaveBeenCalledWith(
        createdTransaction.id,
        TransactionStatus.PENDING
      );
      
      expect(result).toEqual(pendingTransaction);
      expect(result.status).toBe(TransactionStatus.PENDING);
    });

    it('should fail transaction when there is insufficient balance', async () => {
      const createdTransaction = { 
        id: '1', 
        originUserId: mockTransaction.originUserId,
        destinyUserId: mockTransaction.destinyUserId,
        amount: mockTransaction.amount,
        status: TransactionStatus.PENDING,
        createdAt: new Date()
      };
      const failedTransaction = { 
        ...createdTransaction, 
        status: TransactionStatus.FAILED
      };

      transactionRepository.createTransaction.mockResolvedValue(createdTransaction);
      transactionRepository.transferMoney.mockRejectedValue(new Error('Insufficient balance'));
      transactionRepository.updateTransactionStatus.mockResolvedValue(failedTransaction);

      await expect(useCase.execute(mockTransaction)).rejects.toThrow('Failed to create transaction: Insufficient balance');

      expect(transactionValidator.validateTransaction).toHaveBeenCalledTimes(1);
      expect(transactionValidator.validateTransaction).toHaveBeenCalledWith(mockTransaction);
      
      expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(mockTransaction);
      
      expect(transactionRepository.transferMoney).toHaveBeenCalledTimes(1);
      expect(transactionRepository.transferMoney).toHaveBeenCalledWith(
        mockTransaction.originUserId,
        mockTransaction.destinyUserId,
        mockTransaction.amount,
        createdTransaction.id
      );
      
      expect(transactionRepository.updateTransactionStatus).toHaveBeenCalledTimes(1);
      expect(transactionRepository.updateTransactionStatus).toHaveBeenCalledWith(
        createdTransaction.id,
        TransactionStatus.FAILED
      );
    });
  });
}); 