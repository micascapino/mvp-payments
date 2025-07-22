import { Injectable } from "@nestjs/common";
import { User } from "src/models/user.model";
import { SupabaseService } from "src/services/supabase.service";

@Injectable()
export class UserRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserById(id: number): Promise<User> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}