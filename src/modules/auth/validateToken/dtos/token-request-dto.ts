import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TokenRequestDto {
    @ApiProperty({
        description: 'ID del cliente',
        example: 'admin-client'
    })
    @IsString()
    @IsNotEmpty()
    client_id: string;

    @ApiProperty({
        description: 'Secreto del cliente',
        example: 'admin-secret-key'
    })
    @IsString()
    @IsNotEmpty()
    client_secret: string;
}

