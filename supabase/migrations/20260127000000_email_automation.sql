-- Create email_logs table to track sent emails
create table if not exists public.email_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    email_template_id text not null,
    sent_at timestamptz default now() not null,
    status text default 'sent' check (status in ('sent', 'failed', 'opened', 'clicked')),
    metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.email_logs enable row level security;

-- Index for faster lookups when checking if an email was sent
create index if not exists idx_email_logs_user_template on public.email_logs(user_id, email_template_id);

-- RLS Policies
create policy "Users can view their own email logs"
    on public.email_logs for select
    using (auth.uid() = user_id);

-- RPC Function to get candidates efficiently
-- This avoids fetching all users in the Edge Function
create or replace function public.get_onboarding_candidates(
    min_hours int,
    max_hours int,
    template_id text
)
returns table (
    id uuid,
    email text,
    name text
)
security definer
as $$
begin
    return query
    select 
        p.id,
        u.email::text,
        p.name
    from 
        public.profiles p
    join
        auth.users u on p.id = u.id
    where 
        p.created_at >= now() - (max_hours || ' hours')::interval
        and p.created_at < now() - (min_hours || ' hours')::interval
        and not exists (
            select 1 
            from public.email_logs el 
            where el.user_id = p.id 
            and el.email_template_id = template_id
        );
end;
$$ language plpgsql;
