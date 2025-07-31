import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { TransactionStatus } from '../../../../core/entities/transactions';

export class TransactionFilterDto {
    @ApiProperty({
        description: 'Transaction status',
        enum: TransactionStatus,
        required: false
    })
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus;

    @ApiProperty({
        description: 'Destiny account ID',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsOptional()
    @IsString()
    destinyAccountId?: string;

    @ApiProperty({
        description: 'Filter by start date (YYYY-MM-DD)',
        required: false,
        example: '2023-01-01'
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({
        description: 'Filter by end date (YYYY-MM-DD)',
        required: false,
        example: '2023-12-31'
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
} 