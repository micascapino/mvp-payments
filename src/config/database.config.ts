import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export default registerAs<DatabaseConfig>('database', () => ({
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_ANON_KEY || '',
})); 