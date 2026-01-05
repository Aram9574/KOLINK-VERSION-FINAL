-- Migration: Ensure Viral Columns in Posts
-- Date: 2026-01-04
-- Purpose: Guarantee the existence of viral_score and viral_analysis columns to match Frontend types.

DO $$ 
BEGIN
    -- 1. Ensure viral_score (INTEGER or NUMERIC)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='viral_score') THEN
        ALTER TABLE public.posts ADD COLUMN viral_score INTEGER DEFAULT 0;
    END IF;

    -- 2. Ensure viral_analysis (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='viral_analysis') THEN
        ALTER TABLE public.posts ADD COLUMN viral_analysis JSONB DEFAULT '{}';
    END IF;
    
    -- 3. Ensure Indices for Performance (if they don't exist, though optimization sql might have them)
    -- We use 'IF NOT EXISTS' in CREATE INDEX syntax usually, but let's be safe.
END $$;

-- Create Index outside DO block
CREATE INDEX IF NOT EXISTS idx_posts_viral_score_final ON public.posts(viral_score);
