-- KOLINK DB PERFORMANCE OPTIMIZATION V1
-- Author: Antigravity (Database Architect)
-- Date: 2026-02-02

-- 1. INTEGRITY BLINDAGE: Ensure credits can never be negative
ALTER TABLE public.profiles 
ADD CONSTRAINT check_credits_non_negative 
CHECK (credits >= 0);

-- 2. PERFORMANCE SOTA: GIN Indexes for JSONB fields
-- This drastically improves search and filtering in the dashboard and AI analysis

-- Profile DNA (Critical for personalized generation)
CREATE INDEX IF NOT EXISTS idx_profiles_behavioral_dna_gin 
ON public.profiles USING GIN (behavioral_dna);

-- Post Generation Params (Critical for Dashboard filtering by tone/topic)
CREATE INDEX IF NOT EXISTS idx_posts_params_gin 
ON public.posts USING GIN (params);

-- Post Viral Analysis (Optimizes retrieval of scores and reasoning)
CREATE INDEX IF NOT EXISTS idx_posts_viral_analysis_gin 
ON public.posts USING GIN (viral_analysis);

-- Carousel Content & Settings (Improves loading speed of the visual editor)
CREATE INDEX IF NOT EXISTS idx_carousels_data_gin 
ON public.carousels USING GIN (data);

CREATE INDEX IF NOT EXISTS idx_carousels_settings_gin 
ON public.carousels USING GIN (settings);

-- 3. ANALYTICS SPEEDUP: Multi-column optimization
-- If searching posts by user, status and creation date frequently
CREATE INDEX IF NOT EXISTS idx_posts_user_status_date 
ON public.posts(user_id, status, created_at DESC);
