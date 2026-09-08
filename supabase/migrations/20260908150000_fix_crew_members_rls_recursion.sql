-- The original "Crew membership is viewable by fellow members" policy
-- queried crew_members from within its own USING clause (via a "self"
-- alias). Postgres applies a table's RLS policy to every reference to
-- that table, including references inside its own policy, so this
-- caused "infinite recursion detected in policy for relation
-- crew_members" on every select — including from getCrewMembers and
-- getCrewActivityFeed, which is why opening a crew failed right after
-- creating it.
--
-- Fix: check membership through a SECURITY DEFINER function instead.
-- Its internal lookup runs as the function owner, which is exempt
-- from the calling role's row security, so it doesn't re-trigger the
-- policy it's being used to evaluate.

create or replace function public.is_crew_member(target_crew_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.crew_members
    where crew_id = target_crew_id and user_id = auth.uid()
  );
$$;

drop policy if exists "Crew membership is viewable by fellow members" on public.crew_members;

create policy "Crew membership is viewable by fellow members"
  on public.crew_members for select
  to authenticated
  using (public.is_crew_member(crew_id));
