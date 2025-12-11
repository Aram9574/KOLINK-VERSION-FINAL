-- Add tags column to posts table
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for faster tag searching
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN (tags);

-- Comment
COMMENT ON COLUMN public.posts.tags IS 'User defined tags for organization';
