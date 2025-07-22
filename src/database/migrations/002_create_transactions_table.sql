-- Create enum for transaction status
create type transaction_status as enum ('PENDING', 'COMPLETED', 'FAILED', 'REJECTED');

-- Create the transactions table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  origin_user_id bigint references users(id),
  destiny_user_id bigint references users(id),
  amount decimal(10,2) not null,
  status transaction_status not null default 'PENDING',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add trigger to update updated_at
create trigger update_transactions_updated_at
    before update on transactions
    for each row
    execute function update_updated_at_column(); 