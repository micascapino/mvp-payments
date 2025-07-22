import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { Transaction, TransactionStatus } from '../models/transaction.model';
import { CreateTransactionDto } from '../modules/transactions/newTransaction/dto/create-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createTransaction(transaction: CreateTransactionDto): Promise<Transaction> {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        origin_user_id: transaction.originUserId,
        destiny_user_id: transaction.destinyUserId,
        amount: transaction.amount,
        status: TransactionStatus.PENDING,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async transferMoney(
    originUserId: number,
    destinyUserId: number,
    amount: number,
    transactionId: string
  ): Promise<void> {
    const supabase = this.supabaseService.getClient();    
    try {
      const { data: originUser } = await supabase
        .from('users')
        .select('balance')
        .eq('id', originUserId)
        .single();

      if (originUser.balance < amount) throw new Error('Insufficient funds in origin account');

      const { data: destinyUser } = await supabase
        .from('users')
        .select('balance')
        .eq('id', destinyUserId)
        .single();

      const { error: debitError } = await supabase
        .from('users')
        .update({ balance: originUser.balance - amount })
        .eq('id', originUserId);

      if (debitError) throw debitError;

      const { error: creditError } = await supabase
        .from('users')
        .update({ balance: destinyUser.balance + amount })
        .eq('id', destinyUserId);

      if (creditError) throw creditError;

      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: TransactionStatus.COMPLETED })
        .eq('id', transactionId);

      if (updateError) throw updateError;

    } catch (error) {
      await supabase
        .from('transactions')
        .update({ status: TransactionStatus.FAILED })
        .eq('origin_user_id', originUserId)
        .eq('destiny_user_id', destinyUserId)
        .eq('amount', amount)
        .eq('status', TransactionStatus.PENDING);

      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  async getTransactionsByUser(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`origin_user_id.eq.${userId},destiny_user_id.eq.${userId}`)
      .order('created_at');

    if (error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }

    return data;
  }

  async getTransactionById(transactionId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) {
      throw new Error(`Failed to get transaction: ${error.message}`);
    }

    return data;
  }
} 