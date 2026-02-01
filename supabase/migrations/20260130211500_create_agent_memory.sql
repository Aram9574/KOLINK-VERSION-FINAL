-- Create agent_memory table
create table if not exists public.agent_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null, -- 'preference', 'goal', 'fact', 'anti-preference'
  key text not null, -- 'tone_preference', 'company_mission'
  value text not null,
  confidence float default 1.0,
  source text, -- 'chat_id:123', 'onboarding'
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Add a unique constraint to prevent duplicate keys for the same user and category
  -- OR we can allow multiples. Let's enforce unique key per user to keep it simple Key-Value store for now.
  unique(user_id, key)
);

-- Enable RLS
alter table public.agent_memory enable row level security;

-- Policies
create policy "Users can view their own memories"
  on public.agent_memory for select
  using (auth.uid() = user_id);

create policy "Users can insert their own memories"
  on public.agent_memory for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own memories"
  on public.agent_memory for update
  using (auth.uid() = user_id);

create policy "Users can delete their own memories"
  on public.agent_memory for delete
  using (auth.uid() = user_id);

-- Add indexes for performance
create index if not exists agent_memory_user_id_idx on public.agent_memory(user_id);
create index if not exists agent_memory_key_idx on public.agent_memory(key);
