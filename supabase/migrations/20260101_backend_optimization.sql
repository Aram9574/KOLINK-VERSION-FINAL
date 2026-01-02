-- KOLINK Backend Optimization & Normalization
-- Created: 2026-01-01

-- 1. Ensure Global Utilities
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Clean up REDUNANT Audits Schema
-- Target: Consolidate audit_profiles, audit_results, and audits into one unified audits table.
-- We will migrate existing data from 'autid_results' and 'audit_profiles' into 'audits' if they exist, 
-- but for now we optimize the primary 'audits' table and deprecate the others.

DO $$ 
BEGIN
    -- Add profile_data lookup capability to main audits table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audits' AND column_name='raw_data') THEN
        ALTER TABLE public.audits ADD COLUMN raw_data JSONB;
    END IF;
END $$;

-- 3. Cleanup redundant columns in profiles
-- auto_pilot JSONB is redundant with autopilot_config table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='auto_pilot') THEN
        ALTER TABLE public.profiles DROP COLUMN auto_pilot;
    END IF;
END $$;

-- 4. Standardize Timestamps
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        -- Add updated_at if it doesn't exist
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'updated_at') THEN
            EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_%I ON public.%I', t, t);
            EXECUTE format('CREATE TRIGGER set_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t, t);
        END IF;
    END LOOP;
END $$;

-- 5. Performance Indices
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_user_id ON public.carousels(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_viral_score ON public.posts(viral_score);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- GIN Indices for JSONB searching
CREATE INDEX IF NOT EXISTS idx_posts_params_gin ON public.posts USING GIN (params);
CREATE INDEX IF NOT EXISTS idx_audits_results_gin ON public.audits USING GIN (results);

-- 6. Developer Experience: Dashboard View
CREATE OR REPLACE VIEW public.v_user_dashboard AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    p.plan_tier,
    p.credits,
    (SELECT count(*) FROM public.posts WHERE user_id = p.id) as total_posts,
    (SELECT AVG(viral_score) FROM public.posts WHERE user_id = p.id) as avg_viral_score,
    (SELECT count(*) FROM public.notifications WHERE user_id = p.id AND read = false) as unread_notifications
FROM public.profiles p;

-- 7. RPC for stats
CREATE OR REPLACE FUNCTION get_user_activity_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_posts', count(*),
        'max_viral_score', max(viral_score),
        'avg_viral_score', round(avg(viral_score), 1),
        'favorites_count', count(*) FILTER (WHERE is_favorite = true)
    ) INTO result
    FROM public.posts
    WHERE user_id = p_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Standardize RLS for Webhook Logs (Security)
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.webhook_logs
    USING (auth.jwt()->>'role' = 'service_role');
