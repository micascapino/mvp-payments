import { Controller, Get, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Account } from '../../../core/entities/accounts';
import { GetMyAccountUseCase } from './get-my-account-use-case';
import { JwtAuthGuard } from '../../../core/security/guards/jwt-auth.guard';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetMyAccountController {
  constructor(private readonly getMyAccountUseCase: GetMyAccountUseCase) { }

  @Get('me')
  @ApiOperation({ summary: 'Get information about my account' })
  @ApiResponse({
    status: 200,
    description: 'Account retrieved successfully',
    type: Account
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found'
  })
  async getMyAccount(@Request() req): Promise<Account> {
    try {
      const clientId = req.user.clientId;

      if (!clientId) {
        throw new Error('Client ID not found in token');
      }

      return await this.getMyAccountUseCase.execute(clientId);
    } catch (error) {
      if (error.message === 'Account not found') {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
          message: 'No account found for the authenticated user'
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Failed to get account',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
