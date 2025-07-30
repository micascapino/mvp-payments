import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ClientRole } from '../../../../entities/clients';

export class CreateClientDto {
    @ApiProperty({
        description: 'Client ID (username for API access)',
        example: 'john.doe'
    })
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @ApiProperty({
        description: 'Client secret (password for API access)',
        example: 'secret123'
    })
    @IsString()
    @IsNotEmpty()
    clientSecret: string;

    @ApiProperty({
        description: 'Email of the account to associate with this client',
        example: 'john.doe@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Role of the client',
        enum: ClientRole,
        default: ClientRole.USER,
        example: 'user'
    })
    @IsEnum(ClientRole)
    @IsOptional()
    role?: ClientRole = ClientRole.USER;
} 