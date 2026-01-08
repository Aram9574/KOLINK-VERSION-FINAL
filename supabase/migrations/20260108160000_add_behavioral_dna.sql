alter table profiles add column if not exists behavioral_dna jsonb default '{}'::jsonb;
comment on column profiles.behavioral_dna is 'Stores the Expertise DNA (Archetype, Keywords, Negative Keywords) for the user';
