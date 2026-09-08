-- Horizon 1: Durable Identity
-- Adds profiles + experiences tables with RLS, per docs/backend/database-plan.md.
-- Run this once in the Supabase SQL editor (or via `supabase db push` if the
-- CLI is linked to this project).

-- 1. profiles: public display identity, one row per auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by their owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. experiences: a member's logged reaction to a movie.
-- movie_id stores the TMDB id (canonical external reference) rather than
-- duplicating movie metadata, per docs/backend/database-plan.md.
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  movie_id text not null,
  bud_score smallint not null check (bud_score >= 0 and bud_score <= 10),
  mood text not null,
  notes text not null default '',
  contains_spoilers boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists experiences_user_id_idx on public.experiences (user_id);
create index if not exists experiences_movie_id_idx on public.experiences (movie_id);

alter table public.experiences enable row level security;

-- Consumption notes are sensitive member data and must stay private by
-- default (docs/backend/database-plan.md) — owner-only access for now.
create policy "Experiences are viewable by their owner"
  on public.experiences for select
  using (auth.uid() = user_id);

create policy "Experiences are insertable by their owner"
  on public.experiences for insert
  with check (auth.uid() = user_id);

create policy "Experiences are updatable by their owner"
  on public.experiences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Experiences are deletable by their owner"
  on public.experiences for delete
  using (auth.uid() = user_id);

-- 3. Keep updated_at current on mutation.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_experiences_updated_at on public.experiences;
create trigger set_experiences_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

-- 4. Auto-create a profile row when a member signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
