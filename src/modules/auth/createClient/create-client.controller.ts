import { Body, Controller, Post, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuth } from '../../../entities/clients';
import { CreateClientUseCase } from './create-client.use-case';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

@ApiTags('authentication')
@Controller('auth/clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CreateClientController {
  constructor(private readonly createClientUseCase: CreateClientUseCase) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new API client (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ClientAuth
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
  async createClient(
    @Body() client: CreateClientDto
  ): Promise<ClientAuth> {
    try {
      const result = await this.createClientUseCase.execute(client);
      
      // No devolver el hash del secreto en la respuesta
      const { hashedSecret, ...clientWithoutSecret } = result;
      return clientWithoutSecret as ClientAuth;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Failed to create client',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
} 