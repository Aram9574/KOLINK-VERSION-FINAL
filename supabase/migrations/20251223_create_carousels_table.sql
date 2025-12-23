-- Create a table to store carousels
CREATE TABLE IF NOT EXISTS public.carousels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    data JSONB NOT NULL DEFAULT '{"slides": []}'::jsonb,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    theme_id TEXT,
    aspect_ratio TEXT DEFAULT '4/5',
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carousels ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own carousels" 
ON public.carousels FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own carousels" 
ON public.carousels FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carousels" 
ON public.carousels FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own carousels" 
ON public.carousels FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.carousels
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
