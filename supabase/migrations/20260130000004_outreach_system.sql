-- Recreate outreach_contacts table to match user CSV exactly
drop table if exists public.outreach_contacts;

create table public.outreach_contacts (
    id uuid default gen_random_uuid() primary key,
    status text default 'pending' check (status in ('pending', 'contacted', 'replied', 'unsubscribed')),
    last_contacted_at timestamptz,
    created_at timestamptz default now(),
    
    -- Exact columns from User CSV
    "Name" text,
    "Email" text unique not null,
    "Linkedin_Url" text,
    "Organization.Website_Url" text,
    "Title" text,
    "City" text,
    "State" text,
    "Country" text,
    "Headline" text,
    "Organization.Name" text,
    "Organization.Estimated_Num_Employees" text,
    "Organization.Industries" text,
    "Organization.Keywords" text,
    "Organization.Phone" text,
    "Organization-Phone" text,
    "Organization.Founded_Year" text,
    
    metadata jsonb default '{}'::jsonb
);

-- RLS Policies
alter table public.outreach_contacts enable row level security;

create policy "Admins can manage outreach_contacts"
on public.outreach_contacts
for all
using ( (select auth.jwt() ->> 'role') = 'service_role' );

-- Index for efficient lookup of pending contacts
create index idx_outreach_pending on public.outreach_contacts(status) where status = 'pending';
