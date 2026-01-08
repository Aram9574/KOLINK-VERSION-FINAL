CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits locked for update to prevent race conditions
  SELECT credits INTO current_credits FROM profiles WHERE id = user_id FOR UPDATE;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Check sufficiency
  IF current_credits > 0 THEN
    UPDATE profiles SET credits = credits - 1 WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
END;
$$;
