-- Allow email_logs to store outreach emails without a registered user
alter table public.email_logs alter column user_id drop not null;

-- Add optional column to link specifically to outreach contacts
alter table public.email_logs add column if not exists outreach_contact_id uuid;

-- Add foreign key to outreach_contacts table
alter table public.email_logs 
add constraint email_logs_outreach_contact_id_fkey 
foreign key (outreach_contact_id) 
references public.outreach_contacts(id)
on delete cascade;

comment on column public.email_logs.outreach_contact_id is 'Optional link to the outreach_contacts table for external campaigns.';
