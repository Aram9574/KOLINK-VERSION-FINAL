-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store user style fragments for RAG
CREATE TABLE IF NOT EXISTS public.user_style_vectors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(768), -- Dimension for text-embedding-004
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_style_vectors
ALTER TABLE public.user_style_vectors ENABLE ROW LEVEL SECURITY;

-- Policies for user_style_vectors
CREATE POLICY "Users can view own style vectors" 
ON public.user_style_vectors FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own style vectors" 
ON public.user_style_vectors FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own style vectors" 
ON public.user_style_vectors FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own style vectors" 
ON public.user_style_vectors FOR DELETE 
USING (auth.uid() = user_id);

-- Add brand_settings to profiles to store custom branding
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS brand_settings JSONB DEFAULT '{
  "colors": {
    "primary": "#0077b5",
    "secondary": "#ffffff",
    "accent": "#000000"
  },
  "fonts": {
    "title": "Inter",
    "body": "Inter"
  },
  "logo_url": null
}'::jsonb;

-- Create an HNSW index for faster vector similarity search
-- Note: We use cosine similarity (vector_cosine_ops)
CREATE INDEX IF NOT EXISTS user_style_vectors_embedding_idx ON public.user_style_vectors 
USING hnsw (embedding vector_cosine_ops);

-- Create the RPC function for vector similarity search
create or replace function match_user_style (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    user_style_vectors.id,
    user_style_vectors.content,
    1 - (user_style_vectors.embedding <=> query_embedding) as similarity
  from user_style_vectors
  where 1 - (user_style_vectors.embedding <=> query_embedding) > match_threshold
  and user_style_vectors.user_id = p_user_id
  order by user_style_vectors.embedding <=> query_embedding
  limit match_count;
end;
$$;
