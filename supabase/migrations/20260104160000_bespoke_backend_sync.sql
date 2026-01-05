-- Migration: Bespoke Backend Synchronization
-- Description: Harmonizes the Database Schema with the Frontend TypeScript Interfaces
-- Author: Nexus AI

-- 1. Sync 'posts' table with 'Post' interface
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS viral_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS viral_analysis JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_auto_pilot BOOLEAN DEFAULT FALSE;

-- 2. Sync 'profiles' table with 'UserProfile' and 'BehavioralDNA' interfaces
-- Ensure behavioral_dna exists (might overlap with recent migrations, using IF NOT EXISTS is safe)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS behavioral_dna JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS auto_pilot_config JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS gamification_stats JSONB DEFAULT '{"xp": 0, "level": 1, "streak": 0}'::jsonb;

-- 3. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload config';
