-- Create a table for the LinkedIn Expert Knowledge Base
CREATE TABLE IF NOT EXISTS public.linkedin_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(768), -- Dimension for text-embedding-004
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.linkedin_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to search the knowledge base
CREATE POLICY "Anyone can view knowledge base" 
ON public.linkedin_knowledge_base FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create an HNSW index for faster vector similarity search
CREATE INDEX IF NOT EXISTS linkedin_kb_embedding_idx ON public.linkedin_knowledge_base 
USING hnsw (embedding vector_cosine_ops);

-- Create the RPC function for vector similarity search in the knowledge base
CREATE OR REPLACE FUNCTION match_linkedin_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    linkedin_knowledge_base.id,
    linkedin_knowledge_base.content,
    1 - (linkedin_knowledge_base.embedding <=> query_embedding) AS similarity
  FROM linkedin_knowledge_base
  WHERE 1 - (linkedin_knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY linkedin_knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
