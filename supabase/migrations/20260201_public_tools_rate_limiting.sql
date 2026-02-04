-- Migration: Create public_tool_usage table for rate limiting
-- Description: Enables rate limiting for public tools without authentication

-- Create table for tracking public tool usage
CREATE TABLE IF NOT EXISTS public.public_tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    tool_name TEXT NOT NULL CHECK (tool_name IN ('headline', 'bio', 'scorecard')),
    usage_count INTEGER DEFAULT 1 CHECK (usage_count >= 0),
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_usage_record UNIQUE(ip_hash, fingerprint, tool_name)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_public_tool_usage_lookup 
ON public.public_tool_usage(ip_hash, fingerprint, tool_name);

-- Create index for cleanup queries (delete old records)
CREATE INDEX IF NOT EXISTS idx_public_tool_usage_created_at 
ON public.public_tool_usage(created_at);

-- Enable RLS
ALTER TABLE public.public_tool_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to check their own usage (SELECT)
CREATE POLICY "Allow public read own usage"
ON public.public_tool_usage
FOR SELECT
TO anon
USING (true);

-- Policy: Allow anyone to insert new usage records
CREATE POLICY "Allow public insert usage"
ON public.public_tool_usage
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow anyone to update their own usage count
CREATE POLICY "Allow public update own usage"
ON public.public_tool_usage
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Function to increment usage count or insert new record
CREATE OR REPLACE FUNCTION public.increment_tool_usage(
    p_ip_hash TEXT,
    p_fingerprint TEXT,
    p_tool_name TEXT
)
RETURNS TABLE (
    current_count INTEGER,
    limit_reached BOOLEAN,
    reset_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_count INTEGER;
    v_last_used TIMESTAMPTZ;
    v_limit INTEGER;
BEGIN
    -- Set limits per tool
    v_limit := CASE p_tool_name
        WHEN 'scorecard' THEN 2
        ELSE 3
    END;

    -- Try to get existing record
    SELECT usage_count, last_used_at
    INTO v_current_count, v_last_used
    FROM public.public_tool_usage
    WHERE ip_hash = p_ip_hash
        AND fingerprint = p_fingerprint
        AND tool_name = p_tool_name;

    -- If record exists and was used today, increment
    IF FOUND THEN
        -- Reset count if last use was more than 24 hours ago
        IF v_last_used < NOW() - INTERVAL '24 hours' THEN
            UPDATE public.public_tool_usage
            SET usage_count = 1,
                last_used_at = NOW()
            WHERE ip_hash = p_ip_hash
                AND fingerprint = p_fingerprint
                AND tool_name = p_tool_name;
            
            v_current_count := 1;
        ELSE
            -- Increment if under limit
            IF v_current_count < v_limit THEN
                UPDATE public.public_tool_usage
                SET usage_count = usage_count + 1,
                    last_used_at = NOW()
                WHERE ip_hash = p_ip_hash
                    AND fingerprint = p_fingerprint
                    AND tool_name = p_tool_name;
                
                v_current_count := v_current_count + 1;
            END IF;
        END IF;
    ELSE
        -- Insert new record
        INSERT INTO public.public_tool_usage (ip_hash, fingerprint, tool_name, usage_count)
        VALUES (p_ip_hash, p_fingerprint, p_tool_name, 1);
        
        v_current_count := 1;
        v_last_used := NOW();
    END IF;

    -- Return current state
    RETURN QUERY SELECT 
        v_current_count,
        v_current_count >= v_limit,
        (v_last_used + INTERVAL '24 hours')::TIMESTAMPTZ;
END;
$$;

-- Grant execute permission to anon
GRANT EXECUTE ON FUNCTION public.increment_tool_usage TO anon;

-- Function to check usage without incrementing
CREATE OR REPLACE FUNCTION public.check_tool_usage(
    p_ip_hash TEXT,
    p_fingerprint TEXT,
    p_tool_name TEXT
)
RETURNS TABLE (
    current_count INTEGER,
    max_limit INTEGER,
    limit_reached BOOLEAN,
    reset_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_count INTEGER;
    v_last_used TIMESTAMPTZ;
    v_limit INTEGER;
BEGIN
    -- Set limits per tool
    v_limit := CASE p_tool_name
        WHEN 'scorecard' THEN 2
        ELSE 3
    END;

    -- Get existing record
    SELECT usage_count, last_used_at
    INTO v_current_count, v_last_used
    FROM public.public_tool_usage
    WHERE ip_hash = p_ip_hash
        AND fingerprint = p_fingerprint
        AND tool_name = p_tool_name;

    -- If not found or expired, return 0
    IF NOT FOUND OR v_last_used < NOW() - INTERVAL '24 hours' THEN
        v_current_count := 0;
        v_last_used := NOW();
    END IF;

    -- Return current state
    RETURN QUERY SELECT 
        COALESCE(v_current_count, 0),
        v_limit,
        COALESCE(v_current_count, 0) >= v_limit,
        (COALESCE(v_last_used, NOW()) + INTERVAL '24 hours')::TIMESTAMPTZ;
END;
$$;

-- Grant execute permission to anon
GRANT EXECUTE ON FUNCTION public.check_tool_usage TO anon;

-- Comment on table
COMMENT ON TABLE public.public_tool_usage IS 'Tracks usage of public tools for rate limiting without authentication';
