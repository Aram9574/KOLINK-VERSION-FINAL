-- KOLINK DATABASE V2 REBOOT
-- "Surgical Cleanup & Normalization"
-- Date: 2026-01-03

BEGIN;

--------------------------------------------------------------------------------
-- 1. NORMALIZATION: Brand Voices
--------------------------------------------------------------------------------

-- Link profiles to specific brand_voice record
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS active_voice_id UUID REFERENCES public.brand_voices(id);

-- (Optional) Data Migration could go here, but for safety we will let the user 
-- manually re-select their voice in the UI if the connection is lost during cleanup.

-- Remove legacy columns that fragment the truth
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS brand_voice,   -- Moving to brand_voices table completely
DROP COLUMN IF EXISTS autopost_config; -- Moving to autopost_queue logic

--------------------------------------------------------------------------------
-- 2. AUDIT HISTORY (Memoria Estratégica)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profile_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    authority_score INTEGER,
    visual_score INTEGER,
    headline_impact INTEGER,
    keyword_density INTEGER,
    storytelling_power INTEGER, 
    source_type TEXT DEFAULT 'hybrid', -- 'pdf', 'visual', 'hybrid'
    full_analysis JSONB, -- The complete JSON result for history
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS for Audits
ALTER TABLE public.profile_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audits" 
ON public.profile_audits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audits" 
ON public.profile_audits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 3. CREDIT TRANSACTIONS (Billing Transparency)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Negative for spend, Positive for refill
    feature TEXT NOT NULL, -- e.g., 'Voice Lab', 'Audit', 'AutoPost'
    balance_after INTEGER, -- Snapshot of balance at that moment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS for Transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
ON public.credit_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- System-only insert (via Triggers/Functions) - but for MVP we allow authenticated insert if logic is in Edge Function
-- Ideally, only Postgres Functions with SECURITY DEFINER should write here.
-- For now, we allow the user to insert via the authenticated client ONLY if we trust the client logic (which we don't usually).
-- BETTER PRACTICE: Use a Trigger on PROFILES.credits update.

--------------------------------------------------------------------------------
-- 4. CREDIT TRIGGER LOGIC
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION log_credit_transaction()
RETURNS TRIGGER AS $$
DECLARE
    diff INTEGER;
BEGIN
    diff := NEW.credits - OLD.credits;
    
    -- Only log if credit amount changed
    IF diff <> 0 THEN
        INSERT INTO public.credit_transactions (user_id, amount, feature, balance_after)
        VALUES (
            NEW.id, 
            diff, 
            COALESCE(current_setting('app.current_feature', true), 'System Usage'), -- Feature name passed via session var if possible, else Default
            NEW.credits
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid duplication
DROP TRIGGER IF EXISTS on_credits_change ON public.profiles;

CREATE TRIGGER on_credits_change
AFTER UPDATE OF credits ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION log_credit_transaction();

--------------------------------------------------------------------------------
-- 5. CLEANUP OLD TABLES/COLUMNS (Optional Safe Mode)
--------------------------------------------------------------------------------

-- Ensure indices for performance
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON public.profile_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON public.profile_audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON public.credit_transactions(user_id);

COMMIT;
