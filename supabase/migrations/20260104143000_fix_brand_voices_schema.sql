-- Add missing JSONB columns to brand_voices table
ALTER TABLE public.brand_voices 
ADD COLUMN IF NOT EXISTS hook_patterns JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS stylistic_dna JSONB DEFAULT '{}'::jsonb;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
