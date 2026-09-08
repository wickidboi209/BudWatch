-- Make experiences world-readable to power a real community/social feed.
-- Product decision (2026-09-08): BudWatch is a social app (Crew, Movie
-- Nights, community picks) - logging an experience is meant to be seen by
-- other members, not kept private. Insert/update/delete stay owner-only;
-- only SELECT changes.

drop policy if exists "Experiences are viewable by their owner" on public.experiences;

create policy "Experiences are viewable by any signed-in member"
  on public.experiences for select
  to authenticated
  using (true);
