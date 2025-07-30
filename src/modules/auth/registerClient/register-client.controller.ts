import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterClientUseCase } from './register-client.use-case';

@ApiTags('authentication')
@Controller('auth')
export class RegisterClientController {
  constructor(private readonly registerClientUseCase: RegisterClientUseCase) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client registered successfully',
    schema: {
      properties: {
        clientId: { type: 'string', example: 'juan.perez' },
        email: { type: 'string', example: 'juan.perez@example.com' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Client ID or Email already in use'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data'
  })
  async registerClient(@Body() registerData: RegisterClientDto) {
    try {
      return await this.registerClientUseCase.execute(registerData);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        throw error;
      }
      
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Failed to register client',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
} 