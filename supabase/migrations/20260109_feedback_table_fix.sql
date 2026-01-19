-- Safely create table if not exists (although it exists, this is safe)
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('bug', 'suggestion', 'other')) not null,
  message text not null,
  status text check (status in ('open', 'closed', 'in_progress')) default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (idempotent operation)
alter table public.feedback enable row level security;

-- Drop existing policies to ensure clean state
drop policy if exists "Users can insert their own feedback" on public.feedback;
drop policy if exists "Users can view their own feedback" on public.feedback;

-- Recreate policies
create policy "Users can insert their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
