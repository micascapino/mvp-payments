import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from '../../../models/transaction.model';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) { }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: Transaction
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Insufficient balance or invalid data' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Transaction requires validation - Amount exceeds threshold' 
  })
  async createTransaction(
    @Body() transaction: CreateTransactionDto
  ): Promise<Transaction> {
    try {
      return await this.createTransactionUseCase.execute(transaction);
    } catch (error) {
      if (error.message.includes('Insufficient balance')) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Insufficient balance in origin account',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 