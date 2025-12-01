-- Add LinkedIn-specific columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS position TEXT;

-- Comment on columns for clarity
COMMENT ON COLUMN public.profiles.headline IS 'LinkedIn Headline';
COMMENT ON COLUMN public.profiles.industry IS 'LinkedIn Industry';
COMMENT ON COLUMN public.profiles.company_name IS 'Current Company Name';
