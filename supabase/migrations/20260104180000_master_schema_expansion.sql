-- Migration: Master Backend Expansion (The Perfect Fit)
-- Description: Creates all missing tables identified in the Frontend Audit to enable full feature parity.
-- Author: Nexus AI

-- 1. Content Pillars (For AutoPost Studio)
CREATE TABLE IF NOT EXISTS public.content_pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight_percentage INTEGER CHECK (weight_percentage >= 0 AND weight_percentage <= 100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AutoPost Schedule (For Timeline Strategy)
CREATE TABLE IF NOT EXISTS public.autopost_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMPTZ NOT NULL,
    content_idea TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending_approval', 'approved', 'posted', 'rejected')) DEFAULT 'pending_approval',
    confidence_score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Referrals (For "Invite & Earn")
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_email TEXT, -- Can be null if using a generic link click tracking
    referral_code TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'converted')) DEFAULT 'pending',
    reward_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insight Responses (For "Insight Responder")
CREATE TABLE IF NOT EXISTS public.insight_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original_post_url TEXT,
    original_post_image_url TEXT,
    user_intent TEXT,
    tone TEXT,
    generated_response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Hooks (Dynamic Library)
CREATE TABLE IF NOT EXISTS public.hooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    template_text TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Closures/CTAs (Dynamic Library)
CREATE TABLE IF NOT EXISTS public.closures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    template_text TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS Policies (Security First)
ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopost_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closures ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can manage their own pillars" ON public.content_pillars
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule" ON public.autopost_schedule
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their referrals" ON public.referrals
    USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can manage their responses" ON public.insight_responses
    USING (auth.uid() = user_id);

-- Public/Shared Libraries (Hooks/Closures are readable by all authenticated)
CREATE POLICY "Everyone can read hooks" ON public.hooks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Everyone can read closures" ON public.closures
    FOR SELECT TO authenticated USING (true);


-- 8. Notify PostgREST
NOTIFY pgrst, 'reload config';
