-- Migration: Multi-tenancy for linkedin_knowledge_base
-- This migration adds user_id to knowledge base and updates RLS

-- 1. Add user_id column
ALTER TABLE public.linkedin_knowledge_base ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Update existing data to be "system" (user_id is NULL)
-- Already NULL by default, noting for clarity.

-- 3. Update RLS Policies
DROP POLICY IF EXISTS "Anyone can view knowledge base" ON public.linkedin_knowledge_base;

-- Allow users to see system knowledge (user_id IS NULL) OR their own knowledge
CREATE POLICY "Users can view system or own knowledge" 
ON public.linkedin_knowledge_base FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

-- Allow users to insert their own knowledge
CREATE POLICY "Users can insert own knowledge" 
ON public.linkedin_knowledge_base FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own knowledge
CREATE POLICY "Users can delete own knowledge" 
ON public.linkedin_knowledge_base FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Update the match function to strictly filter by user_id
CREATE OR REPLACE FUNCTION match_linkedin_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_user_id uuid DEFAULT NULL
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
  WHERE (linkedin_knowledge_base.user_id IS NULL OR linkedin_knowledge_base.user_id = p_user_id)
    AND 1 - (linkedin_knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY linkedin_knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
