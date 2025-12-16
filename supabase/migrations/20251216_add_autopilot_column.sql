-- Add auto_pilot column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS auto_pilot JSONB DEFAULT '{"enabled": false, "nextRun": 0}'::jsonb;

-- Create index on auto_pilot for faster querying by the scheduler
CREATE INDEX IF NOT EXISTS idx_profiles_autopilot ON public.profiles USING GIN (auto_pilot);
