-- Create Enums
DO $$ BEGIN
    CREATE TYPE plan_tier_enum AS ENUM ('free', 'pro', 'viral');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE app_language_enum AS ENUM ('en', 'es');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Handle plan_tier
-- Drop default first to avoid casting error
ALTER TABLE profiles ALTER COLUMN plan_tier DROP DEFAULT;

-- Change type with casting
ALTER TABLE profiles 
ALTER COLUMN plan_tier TYPE plan_tier_enum 
USING (
  CASE 
    WHEN plan_tier = 'free' THEN 'free'::plan_tier_enum
    WHEN plan_tier = 'pro' THEN 'pro'::plan_tier_enum
    WHEN plan_tier = 'viral' THEN 'viral'::plan_tier_enum
    ELSE 'free'::plan_tier_enum
  END
);

-- Re-apply default with correct type
ALTER TABLE profiles ALTER COLUMN plan_tier SET DEFAULT 'free'::plan_tier_enum;


-- 2. Handle language
-- Drop default first
ALTER TABLE profiles ALTER COLUMN language DROP DEFAULT;

-- Change type with casting
ALTER TABLE profiles 
ALTER COLUMN language TYPE app_language_enum 
USING (
  CASE 
    WHEN language = 'en' THEN 'en'::app_language_enum
    WHEN language = 'es' THEN 'es'::app_language_enum
    ELSE 'es'::app_language_enum
  END
);

-- Re-apply default with correct type
ALTER TABLE profiles ALTER COLUMN language SET DEFAULT 'es'::app_language_enum;


-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_last_seen ON user_sessions(user_id, last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
