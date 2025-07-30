import { Body, Controller, Post, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Account } from '../../../entities/accounts';
import { CreateAccountUseCase } from './new-account-use-case';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NewAccountController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new account (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: Account
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions (Admin required)'
  })
  async createAccount(
    @Body() account: CreateAccountDto
  ): Promise<Account> {
    try {
      return await this.createAccountUseCase.execute(account);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Failed to create account',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
