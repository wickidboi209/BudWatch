-- Crew groups: a private set of members who can see each other's
-- experiences as a scoped feed. Joining is via a shareable invite code
-- (no username/friend-search system exists yet).

create table if not exists public.crews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.crew_members (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (crew_id, user_id)
);

create index if not exists crew_members_crew_id_idx on public.crew_members (crew_id);
create index if not exists crew_members_user_id_idx on public.crew_members (user_id);

alter table public.crews enable row level security;
alter table public.crew_members enable row level security;

-- Crew name + invite code are readable by any signed-in member so a
-- code can be resolved to a crew before joining it.
create policy "Crews are viewable by any signed-in member"
  on public.crews for select
  to authenticated
  using (true);

create policy "Crews are creatable by their founder"
  on public.crews for insert
  to authenticated
  with check (created_by = auth.uid());

-- Membership rows are only visible to people who are themselves a
-- member of that same crew (self-referencing check).
create policy "Crew membership is viewable by fellow members"
  on public.crew_members for select
  to authenticated
  using (
    exists (
      select 1 from public.crew_members self
      where self.crew_id = crew_members.crew_id and self.user_id = auth.uid()
    )
  );

create policy "Members can join a crew for themselves"
  on public.crew_members for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Members can leave a crew"
  on public.crew_members for delete
  to authenticated
  using (user_id = auth.uid());
