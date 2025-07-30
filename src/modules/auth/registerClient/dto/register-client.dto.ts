import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterClientDto {
  @ApiProperty({
    description: 'Client ID (username)',
    example: 'juan.perez'
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'Client secret (password)',
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  clientSecret: string;

  @ApiProperty({
    description: 'Email address',
    example: 'juan.perez@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

} 