-- Crew chat: a simple message log per crew, readable and writable only
-- by that crew's members. Reuses the is_crew_member() helper added in
-- 20260908150000_fix_crew_members_rls_recursion.sql to avoid the same
-- recursion pitfall.

create table if not exists public.crew_messages (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists crew_messages_crew_id_created_at_idx on public.crew_messages (crew_id, created_at);

alter table public.crew_messages enable row level security;

create policy "Crew messages are viewable by fellow members"
  on public.crew_messages for select
  to authenticated
  using (public.is_crew_member(crew_id));

create policy "Crew members can send messages"
  on public.crew_messages for insert
  to authenticated
  with check (user_id = auth.uid() and public.is_crew_member(crew_id));

-- Stream inserts to subscribed clients so the chat updates live.
alter publication supabase_realtime add table public.crew_messages;
