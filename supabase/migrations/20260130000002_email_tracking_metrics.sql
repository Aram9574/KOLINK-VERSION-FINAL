-- Migration to add engagement tracking to public.email_logs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_logs' AND column_name = 'opened_at') THEN
        ALTER TABLE public.email_logs ADD COLUMN opened_at timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_logs' AND column_name = 'clicked_at') THEN
        ALTER TABLE public.email_logs ADD COLUMN clicked_at timestamptz;
    END IF;
END $$;

COMMENT ON COLUMN public.email_logs.opened_at IS 'When the email was first opened.';
COMMENT ON COLUMN public.email_logs.clicked_at IS 'When a link in the email was clicked.';
