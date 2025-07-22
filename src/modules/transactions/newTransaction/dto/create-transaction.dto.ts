import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({
        description: 'ID of the user who is sending the money',
        example: 1
    })
    @IsNotEmpty()
    originUserId: number;

    @ApiProperty({
        description: 'ID of the user who is receiving the money',
        example: 2,
    })
    @IsNotEmpty()
    destinyUserId: number;

    @ApiProperty({
        description: 'Amount of money to transfer',
        example: 100.50,
        minimum: 0.01
    })
    @IsNumber()
    @Min(0.01)
    amount: number;
} 