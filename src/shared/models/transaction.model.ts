import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../core/entities/transactions';

export class Transaction {
  @ApiProperty({
    description: 'The unique identifier of the transaction',
    example: '1234b-1234b-1234b-1234b'
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the user who sent the money',
    example: '1234b-1234b-1234b-1234b'
  })
  originAccountId: string;

  @ApiProperty({
    description: 'The ID of the user who received the money',
    example: '1234b-1234b-1234b-1234b'
  })
  destinyAccountId: string;

  @ApiProperty({
    description: 'The amount of money transferred',
    example: 1000
  })
  amount: number;

  @ApiProperty({
    description: 'The status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @ApiProperty({ 
    description: 'The date when the transaction was created',
    required: false
  })
  createdAt?: Date;

  @ApiProperty({ 
    description: 'The date when the transaction was last updated',
    required: false
  })
  updatedAt?: Date;
} 