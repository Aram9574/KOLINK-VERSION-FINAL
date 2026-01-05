-- Migration: User Behavioral DNA & Event Tracking
-- This migration enables KOLINK to track user behavior and distill it into a personal DNA.

-- 1. Create user_events table
CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'post_generated', 'chat_message', 'login', 'carousel_created', 'audit_started'
    metadata JSONB DEFAULT '{}', -- Store tone, format, length, length of message, etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON public.user_events(created_at);

-- 2. Add behavioral_dna to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS behavioral_dna JSONB DEFAULT '{
    "archetype": "Desconocido",
    "dominant_tone": "Neutro",
    "peak_hours": [],
    "preferred_formats": [],
    "last_updated": null,
    "personality_traits": []
}';

-- RLS for user_events
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own events"
ON public.user_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events"
ON public.user_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- System can manage all (for edge functions with service role)
CREATE POLICY "System can manage all events"
ON public.user_events FOR ALL
USING (true)
WITH CHECK (true);
