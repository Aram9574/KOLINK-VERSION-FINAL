-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS brand_voice TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS security_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_post_date BIGINT,
ADD COLUMN IF NOT EXISTS unlocked_achievements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS auto_pilot JSONB DEFAULT '{"enabled": false, "frequency": "daily", "nextRun": 0, "topics": [], "tone": "Professional & Authoritative", "targetAudience": "Professional Network", "postCount": 1}';
