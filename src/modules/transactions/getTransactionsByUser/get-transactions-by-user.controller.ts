import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetTransactionsByUserUseCase } from "./get-transactions-by-user.use-case";
import { Transaction } from "src/models/transaction.model";

@ApiTags('transactions')
@Controller('transactions')
export class GetTransactionsByUserController {
  constructor(private readonly getTransactionsByUserUseCase: GetTransactionsByUserUseCase) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get transactions by user' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: [Transaction]
  })
  async getTransactionsByUser(@Param('userId') userId: string) {
    return this.getTransactionsByUserUseCase.execute(userId);
  }
}

