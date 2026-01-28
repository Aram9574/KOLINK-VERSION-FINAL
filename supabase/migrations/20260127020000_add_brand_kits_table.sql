-- Create brand_kits table
CREATE TABLE IF NOT EXISTS public.brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    colors JSONB NOT NULL DEFAULT '{}'::jsonb,
    fonts JSONB NOT NULL DEFAULT '{}'::jsonb,
    logos TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own brand kits"
    ON public.brand_kits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand kits"
    ON public.brand_kits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand kits"
    ON public.brand_kits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand kits"
    ON public.brand_kits FOR DELETE
    USING (auth.uid() = user_id);

-- Add index
CREATE INDEX idx_brand_kits_user_id ON public.brand_kits(user_id);
