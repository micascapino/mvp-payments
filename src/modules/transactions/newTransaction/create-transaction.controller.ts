import { Body, Controller, Post, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Transaction } from '../../../core/entities/transactions';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { TransactionOwnerGuard } from '../../../core/security/guards/transaction-owner.guard';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard, TransactionOwnerGuard)
@ApiBearerAuth()
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions or not account owner'
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