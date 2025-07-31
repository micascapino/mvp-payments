import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../../../core/entities/transactions';

export class MyTransactionDto {
    @ApiProperty({
        description: 'Transaction ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Origin account ID',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    originAccountId: string;

    @ApiProperty({
        description: 'Destiny account ID',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    destinyAccountId: string;

    @ApiProperty({
        description: 'Transaction amount',
        example: 1000.00
    })
    amount: number;

    @ApiProperty({
        description: 'Transaction status',
        enum: TransactionStatus,
        example: TransactionStatus.COMPLETED
    })
    status: TransactionStatus;

    @ApiProperty({
        description: 'Creation date',
        example: '2023-01-01T00:00:00Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Update date',
        example: '2023-01-01T00:00:00Z'
    })
    updatedAt: Date;
} 