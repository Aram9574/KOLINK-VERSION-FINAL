-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    device_id TEXT NOT NULL, -- Client-generated ID to track specific browsers
    user_agent TEXT,
    ip_address TEXT,
    device_info JSONB,
    last_seen TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_id)
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own sessions" 
ON user_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" 
ON user_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- Only service role (Edge Function) should insert/update usually, 
-- but we can allow users to update their own 'last_seen' if we wanted direct access.
-- For now, we'll let the Edge Function handle upserts via service_role, 
-- or allow the user to insert their own session if they match the user_id.

CREATE POLICY "Users can insert/update own sessions" 
ON user_sessions FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
