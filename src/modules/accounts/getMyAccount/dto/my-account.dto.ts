import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsEmail } from 'class-validator';

export class GetMyAccountDto {
    @ApiProperty({
        description: 'Account/User name',
        example: 'John Doe'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com'
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Initial balance',
        example: 1000.00,
        minimum: 0
    })
    @IsNumber()
    @Min(0)
    balance: number;
} 