-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store 'Gold Standard' profile benchmarks
create table if not exists profile_benchmarks (
  id uuid primary key default gen_random_uuid(),
  category text not null,        -- e.g., "SaaS Founder", "Marketing Expert", "B2B Sales"
  section text not null,         -- e.g., "headline", "about", "experience_desc"
  content text not null,         -- The actual text content to act as the gold standard
  embedding vector(768),         -- Google text-embedding-004 uses 768 dimensions
  metadata jsonb default '{}'::jsonb, -- Store detailed critique notes or engagement stats
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster similarity search
create index on profile_benchmarks using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Function to find similar benchmarks
create or replace function match_benchmarks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_category text default null
)
returns table (
  id uuid,
  content text,
  category text,
  section text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    profile_benchmarks.id,
    profile_benchmarks.content,
    profile_benchmarks.category,
    profile_benchmarks.section,
    profile_benchmarks.metadata,
    1 - (profile_benchmarks.embedding <=> query_embedding) as similarity
  from profile_benchmarks
  where 1 - (profile_benchmarks.embedding <=> query_embedding) > match_threshold
  and (filter_category is null or profile_benchmarks.category = filter_category)
  order by profile_benchmarks.embedding <=> query_embedding
  limit match_count;
end;
$$;
