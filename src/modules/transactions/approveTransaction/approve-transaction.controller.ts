import { Controller, HttpException, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from '../../../models/transaction.model';
import { ApproveTransactionUseCase } from './approve-transaction.use-case';
import { TransactionStatusError } from '../../../shared/errors/transaction.errors';

@ApiTags('transactions')
@Controller('transactions')
export class ApproveTransactionController {
    constructor(private readonly approveTransactionUseCase: ApproveTransactionUseCase) { }

    @Patch(':transactionId/approve')
    @ApiOperation({ summary: 'Approve a pending transaction' })
    @ApiResponse({
        status: 200,
        description: 'Transaction approved successfully',
        type: Transaction
    })
    @ApiResponse({
        status: 400,
        description: 'Transaction cannot be approved - Not in pending status'
    })
    async approveTransaction(
        @Param('transactionId') transactionId: string
    ) {
        try {
            return await this.approveTransactionUseCase.execute(transactionId);
        } catch (error) {
            if (error instanceof TransactionStatusError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Transaction cannot be approved',
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