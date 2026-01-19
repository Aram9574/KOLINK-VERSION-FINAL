-- Add missing columns if they don't exist
alter table public.feedback 
add column if not exists message text,
add column if not exists type text check (type in ('bug', 'suggestion', 'other'));

-- Make message nullable temporarily if we have data, or just ensure it exists. 
-- Since we are in dev, we can enforce it.
update public.feedback set message = content where message is null and content is not null;
update public.feedback set type = 'other' where type is null;

-- Now make them not null if desired, or leave as is. 
alter table public.feedback alter column message set default '';
alter table public.feedback alter column type set default 'other';
