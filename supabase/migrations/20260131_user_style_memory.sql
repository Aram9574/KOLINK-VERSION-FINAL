-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store User's specific style examples (Style Memory)
create table if not exists user_style_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,         -- The actual text of the post/snippet
  embedding vector(768),         -- text-embedding-004 dimensions
  metadata jsonb default '{}'::jsonb, -- e.g. { "source": "linkedin", "likes": 150 }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table user_style_memory enable row level security;

-- Policies
create policy "Users can insert their own style memories"
on user_style_memory for insert
with check (auth.uid() = user_id);

create policy "Users can view their own style memories"
on user_style_memory for select
using (auth.uid() = user_id);

create policy "Users can update their own style memories"
on user_style_memory for update
using (auth.uid() = user_id);

create policy "Users can delete their own style memories"
on user_style_memory for delete
using (auth.uid() = user_id);

-- Index for faster similarity search (HNSW is generally better for performance/recall balance)
create index if not exists user_style_memory_embedding_idx 
on user_style_memory 
using hnsw (embedding vector_cosine_ops);

-- Function to match user's own style examples
create or replace function match_user_style (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    user_style_memory.id,
    user_style_memory.content,
    user_style_memory.metadata,
    1 - (user_style_memory.embedding <=> query_embedding) as similarity
  from user_style_memory
  where 1 - (user_style_memory.embedding <=> query_embedding) > match_threshold
  and user_style_memory.user_id = auth.uid() -- Critical: Only search user's own data
  order by user_style_memory.embedding <=> query_embedding
  limit match_count;
end;
$$;
