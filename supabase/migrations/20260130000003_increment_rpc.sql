-- RPC Function to atomically increment total_generations
create or replace function public.increment_total_generations(target_user_id uuid)
returns integer
security definer
as $$
declare
    new_count integer;
begin
    update public.profiles
    set total_generations = coalesce(total_generations, 0) + 1,
        last_aha_moment_at = case 
            when coalesce(total_generations, 0) = 0 then now() 
            else last_aha_moment_at 
        end,
        updated_at = now()
    where id = target_user_id
    returning total_generations into new_count;

    return new_count;
end;
$$ language plpgsql;

COMMENT ON FUNCTION public.increment_total_generations IS 'Increments the total_generations count and sets last_aha_moment_at on the first generation.';
