import { Controller, HttpStatus, Param, Patch, HttpException } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RejectTransactionUseCase } from "./reject-transaction.use-case";
import { Transaction } from "src/models/transaction.model";
import { TransactionStatusError } from "src/shared/errors/transaction.errors";

@ApiTags('transactions')
@Controller('transactions')
export class RejectTransactionController {
    constructor(private readonly rejectTransactionUseCase: RejectTransactionUseCase) { }

    @Patch(':transactionId/reject')
    @ApiOperation({ summary: 'Reject a pending transaction' })
    @ApiResponse({
        status: 200,
        description: 'Transaction rejected successfully',
        type: Transaction
    })
    @ApiResponse({
        status: 400,
        description: 'Transaction cannot be rejected - Not in pending status'
    })
    async rejectTransaction(@Param('transactionId') transactionId: string) {
        try {
            return await this.rejectTransactionUseCase.execute(transactionId);
        } catch (error) {
            if (error instanceof TransactionStatusError) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'Transaction cannot be rejected',
                    message: error.message
                };
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal server error',
                message: error.message
            };
        }
    }
}