-- Add Gamification fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_post_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS unlocked_achievements TEXT[] DEFAULT '{}';

-- Create table for achievements if we want to store more details in the future
-- For now, we'll use the profile column as in the legacy version.
