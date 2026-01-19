-- Drop redundant/conflicting policies found in pg_policies
drop policy if exists "Users can insert own feedback" on public.feedback;
drop policy if exists "Admins can view feedback" on public.feedback;

-- Re-ensure standard policies are active (idempotent)
drop policy if exists "Users can insert their own feedback" on public.feedback;
create policy "Users can insert their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view their own feedback" on public.feedback;
create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
