create table if not exists snippets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  last_used_at timestamptz
);

alter table snippets enable row level security;

create policy "Users can crud their own snippets"
  on snippets for all
  using (auth.uid() = user_id);
