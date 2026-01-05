-- Migration: Final Schema Alignment
-- Description: Implements the missing tables and columns requested by the user to complete the KOLINK data model.

-- 1. Subscriptions Table
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

-- 2. Fragments Table
CREATE TABLE IF NOT EXISTS public.fragments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Nexus Conversations Table
CREATE TABLE IF NOT EXISTS public.nexus_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]'::jsonb,
    context_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Drafts Table
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('post', 'carousel')) DEFAULT 'post',
    content JSONB DEFAULT '{}'::jsonb,
    last_saved_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Scheduled Posts Table (Extension of Posts concept, but specific wrapper for schedule metadata if distinct from posts table)
-- Note: 'posts' table already has 'scheduled_at' and 'status', but this table serves as a specific queue log as requested.
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    scheduled_datetime TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending',
    linkedin_scheduled_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Updates to Posts Table
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS emoji_density INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hashtags_count INTEGER DEFAULT 0;

-- 8. Updates to Profiles Table (Users)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- 9. Enable RLS on New Tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies
-- Subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Fragments
CREATE POLICY "Users can manage own fragments" ON public.fragments
    USING (auth.uid() = user_id);

-- Achievements
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Nexus Conversations
CREATE POLICY "Users can manage own conversations" ON public.nexus_conversations
    USING (auth.uid() = user_id);

-- Drafts
CREATE POLICY "Users can manage own drafts" ON public.drafts
    USING (auth.uid() = user_id);

-- Scheduled Posts
CREATE POLICY "Users can manage own scheduled posts" ON public.scheduled_posts
    USING (auth.uid() = user_id);

-- 11. Notify PostgREST
NOTIFY pgrst, 'reload config';
