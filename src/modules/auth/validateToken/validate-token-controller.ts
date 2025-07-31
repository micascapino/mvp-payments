import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "src/shared/services/auth.service";
import { TokenResponseDto } from "./dtos/token-response-dto";
import { TokenRequestDto } from "./dtos/token-request-dto";

@ApiTags('authentication')
@Controller('auth')
export class ValidateTokenController {
  constructor(private authService: AuthService) { }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get access token using Client Credentials' })
  @ApiResponse({
    status: 200,
    description: 'Token generated successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() body: TokenRequestDto): Promise<TokenResponseDto> {
    const token = await this.authService.validateClient(body.client_id, body.client_secret);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: token,
      token_type: 'Bearer'
    };
  }
}