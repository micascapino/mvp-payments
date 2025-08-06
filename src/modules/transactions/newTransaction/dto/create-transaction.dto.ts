import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsUUID, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
    @ApiProperty({
        description: 'ID of the account sending the money',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsNotEmpty()
    @IsUUID()
    originAccountId: string;

    @ApiProperty({
        description: 'ID of the account receiving the money',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    @IsNotEmpty()
    @IsUUID()
    destinyAccountId: string;

    @ApiProperty({
        description: 'Amount of money to transfer',
        example: 100.50,
        minimum: 0.01
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0.01)
    @Transform(({ value }) => parseFloat(value))
    amount: number;
} 