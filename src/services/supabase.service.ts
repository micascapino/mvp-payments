import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseConfig } from '../config/database.config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const dbConfig = this.configService.get<DatabaseConfig>('database');

    this.supabase = createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
} 