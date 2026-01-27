-- KOLINK 2.0 CORE SCHEMA
-- Author: Antigravity
-- Date: 2026-01-25

-- 1. VOICE MODELS (VoiceLab)
CREATE TABLE IF NOT EXISTS public.voice_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    voice_profile JSONB NOT NULL DEFAULT '{}', -- Stores tones, vocabulary, stylistic DNA
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREDITS LEDGER (Transactional Credit Safety)
CREATE TABLE IF NOT EXISTS public.credits_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Negative for deductions, Positive for additions
    transaction_type TEXT NOT NULL, -- 'post_generation', 'carousel_generation', 'audit', 'top_up', etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILE AUDITS (Audit Brain)
CREATE TABLE IF NOT EXISTS public.profile_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    linkedin_url TEXT NOT NULL,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    results JSONB NOT NULL DEFAULT '{}', -- Actionable feedback, strategic roadmap
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOOK LIBRARY (Premium Opening Hooks)
CREATE TABLE IF NOT EXISTS public.hook_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    hook_template TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE public.voice_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hook_library ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy Helper
DO $$
BEGIN
    -- Voice Models
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own voice models' AND tablename = 'voice_models') THEN
        CREATE POLICY "Users can manage own voice models" ON public.voice_models USING (auth.uid() = user_id);
    END IF;

    -- Credits Ledger
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own credit ledger' AND tablename = 'credits_ledger') THEN
        CREATE POLICY "Users can view own credit ledger" ON public.credits_ledger FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Profile Audits
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own audits' AND tablename = 'profile_audits') THEN
        CREATE POLICY "Users can view own audits" ON public.profile_audits FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Hook Library
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view hook library' AND tablename = 'hook_library') THEN
        CREATE POLICY "Anyone can view hook library" ON public.hook_library FOR SELECT USING (true);
    END IF;
END
$$;

-- Triggers for Credits Ledger (Update profile balance)
CREATE OR REPLACE FUNCTION public.update_profile_credits_on_ledger()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET credits = credits + NEW.amount
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid errors on reapplying
DROP TRIGGER IF EXISTS trigger_update_credits ON public.credits_ledger;

CREATE TRIGGER trigger_update_credits
AFTER INSERT ON public.credits_ledger
FOR EACH ROW EXECUTE FUNCTION public.update_profile_credits_on_ledger();

-- 5. SECURE CREDIT DEDUCTION (RPC)
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT credits INTO current_credits FROM public.profiles WHERE id = p_user_id;
    
    IF current_credits IS NULL OR current_credits < p_amount THEN
        RETURN FALSE;
    END IF;

    INSERT INTO public.credits_ledger (user_id, amount, transaction_type, metadata)
    VALUES (p_user_id, -p_amount, p_type, p_metadata);

    RETURN TRUE;
END;
$$;
