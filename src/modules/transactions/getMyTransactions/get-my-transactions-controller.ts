import { Controller, Get, HttpException, HttpStatus, UseGuards, Request, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Transaction, TransactionStatus } from '../../../core/entities/transactions';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';
import { GetMyTransactionsUseCase } from './get-my-transactions-use-case';
import { TransactionFilterDto } from './dto/transaction-filter.dto';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetMyTransactionsController {
  constructor(private readonly getMyTransactionsUseCase: GetMyTransactionsUseCase) { }

  @Get('me')
  @ApiOperation({ summary: 'Get my transactions' })
  @ApiQuery({ name: 'status', enum: TransactionStatus, required: false })
  @ApiQuery({ name: 'destinyAccountId', type: String, required: false })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: [Transaction]
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 404,
    description: 'No transactions found'
  })
  async getMyTransactions(
    @Request() req,
    @Query() filters: TransactionFilterDto
  ): Promise<Transaction[]> {
    try {
      const clientId = req.user.clientId;

      if (!clientId) {
        throw new Error('Client ID not found in token');
      }

      return await this.getMyTransactionsUseCase.execute(clientId, filters);
    } catch (error) {
      if (error.message === 'No transactions found') {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'No transactions found',
          message: 'No transactions found for the authenticated user'
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting transactions',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
} 