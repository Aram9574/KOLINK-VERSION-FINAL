-- KOLINK Extreme Optimization Migration
-- Created: 2026-01-01

-- 1. Denormalized Aggregates for Ultra-Fast Dashboard Reads
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_posts INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_carousels INTEGER DEFAULT 0;

-- Function to maintain counters automatically
CREATE OR REPLACE FUNCTION public.sync_profile_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (TG_TABLE_NAME = 'posts') THEN
            UPDATE public.profiles SET total_posts = total_posts + 1 WHERE id = NEW.user_id;
        ELSIF (TG_TABLE_NAME = 'carousels') THEN
            UPDATE public.profiles SET total_carousels = total_carousels + 1 WHERE id = NEW.user_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (TG_TABLE_NAME = 'posts') THEN
            UPDATE public.profiles SET total_posts = GREATEST(0, total_posts - 1) WHERE id = OLD.user_id;
        ELSIF (TG_TABLE_NAME = 'carousels') THEN
            UPDATE public.profiles SET total_carousels = GREATEST(0, total_carousels - 1) WHERE id = OLD.user_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Triggers
DROP TRIGGER IF EXISTS trigger_sync_posts ON public.posts;
CREATE TRIGGER trigger_sync_posts 
AFTER INSERT OR DELETE ON public.posts 
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_aggregates();

DROP TRIGGER IF EXISTS trigger_sync_carousels ON public.carousels;
CREATE TRIGGER trigger_sync_carousels 
AFTER INSERT OR DELETE ON public.carousels 
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_aggregates();

-- Initial sync (only if there is existing data)
UPDATE public.profiles p SET 
    total_posts = (SELECT count(*) FROM public.posts WHERE user_id = p.id),
    total_carousels = (SELECT count(*) FROM public.carousels WHERE user_id = p.id);

-- 2. Data Integrity Constraints
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS credits_non_negative;
ALTER TABLE public.profiles ADD CONSTRAINT credits_non_negative CHECK (credits >= 0);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS xp_non_negative;
ALTER TABLE public.profiles ADD CONSTRAINT xp_non_negative CHECK (xp >= 0);

ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS viral_score_range;
ALTER TABLE public.posts ADD CONSTRAINT viral_score_range CHECK (viral_score BETWEEN 0 AND 100);

-- 3. Automated Maintenance (pg_cron)
CREATE OR REPLACE FUNCTION public.vacuum_cleanup_tasks()
RETURNS VOID AS $$
BEGIN
    -- Delete webhook logs older than 30 days
    DELETE FROM public.webhook_logs WHERE created_at < now() - interval '30 days';
    
    -- Optimize tables
    ANALYZE public.posts;
    ANALYZE public.profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the task to run daily at midnight
SELECT cron.schedule('daily-cleanup', '0 0 * * *', 'SELECT public.vacuum_cleanup_tasks()');

-- 4. Optimized RLS Policies (Direct auth.uid() lookup)
DROP POLICY IF EXISTS "Users can view own posts" ON public.posts;
CREATE POLICY "Users can view own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- 5. Updated Dashboard View (Using denormalized columns)
CREATE OR REPLACE VIEW public.v_user_dashboard AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    p.plan_tier,
    p.credits,
    p.total_posts,
    p.total_carousels,
    (SELECT AVG(viral_score) FROM public.posts WHERE user_id = p.id) as avg_viral_score,
    (SELECT count(*) FROM public.notifications WHERE user_id = p.id AND read = false) as unread_notifications
FROM public.profiles p;
