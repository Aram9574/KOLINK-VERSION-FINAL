-- KOLINK SOTA MASTER SCHEMA V2 (Consolidated & Idempotent)
-- Author: Antigravity
-- Date: 2026-01-05

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. PROFILES (Base Table)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    headline TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    location TEXT,
    about TEXT,
    skills TEXT[],
    language TEXT DEFAULT 'es',
    brand_voice TEXT,
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    behavioral_dna JSONB DEFAULT '{
        "archetype": "Desconocido",
        "dominant_tone": "Neutro",
        "peak_hours": [],
        "preferred_formats": [],
        "last_updated": null,
        "personality_traits": []
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT CHECK (plan_type IN ('inicial', 'pro', 'viral')) DEFAULT 'inicial',
    status TEXT DEFAULT 'active',
    billing_cycle TEXT CHECK (billing_cycle IN ('mensual', 'anual')) DEFAULT 'mensual',
    price NUMERIC DEFAULT 0,
    credits_limit INTEGER DEFAULT 0,
    reset_date TIMESTAMPTZ,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POSTS & CAROUSELS
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    linkedin_post_id TEXT,
    emoji_density INTEGER DEFAULT 0,
    hashtags_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.carousels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    slides JSONB NOT NULL DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KNOWLEDGE BASE (RAG)
CREATE TABLE IF NOT EXISTS public.linkedin_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Ensure user_id column exists if table was created without it
ALTER TABLE public.linkedin_knowledge_base ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;


-- 5. USER EVENTS & DNA ANALYTICS
CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NEXUS CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.nexus_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]'::jsonb,
    context_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_user_id ON public.carousels(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_user_id ON public.linkedin_knowledge_base(user_id);

-- 9. SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_conversations ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy Helper (To avoid "already exists" errors)
DO $$
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can manage own profile" ON public.profiles USING (auth.uid() = id);
    END IF;
    
    -- Subscriptions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscription' AND tablename = 'subscriptions') THEN
        CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own posts' AND tablename = 'posts') THEN
        CREATE POLICY "Users can manage own posts" ON public.posts USING (auth.uid() = user_id);
    END IF;

    -- Carousels
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own carousels' AND tablename = 'carousels') THEN
        CREATE POLICY "Users can manage own carousels" ON public.carousels USING (auth.uid() = user_id);
    END IF;

    -- Knowledge Base
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view system or own knowledge' AND tablename = 'linkedin_knowledge_base') THEN
        CREATE POLICY "Users can view system or own knowledge" ON public.linkedin_knowledge_base FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
    END IF;

    -- Notifications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can manage own notifications" ON public.notifications USING (auth.uid() = user_id);
    END IF;

    -- Nexus
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own conversations' AND tablename = 'nexus_conversations') THEN
        CREATE POLICY "Users can manage own conversations" ON public.nexus_conversations USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 10. FUNCTIONS
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
    lkb.id,
    lkb.content,
    1 - (lkb.embedding <=> query_embedding) AS similarity
  FROM linkedin_knowledge_base lkb
  WHERE (lkb.user_id IS NULL OR lkb.user_id = p_user_id)
    AND 1 - (lkb.embedding <=> query_embedding) > match_threshold
  ORDER BY lkb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
