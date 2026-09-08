-- Watchlist: a member's saved-for-later movies.
-- movie_id stores the TMDB id (canonical external reference) rather than
-- duplicating movie metadata, matching the pattern in experiences.
-- Run this once in the Supabase SQL editor (or via `supabase db push` if the
-- CLI is linked to this project).

create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  movie_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, movie_id)
);

create index if not exists watchlist_user_id_idx on public.watchlist (user_id);

alter table public.watchlist enable row level security;

create policy "Watchlist is viewable by its owner"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Watchlist is insertable by its owner"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Watchlist is deletable by its owner"
  on public.watchlist for delete
  using (auth.uid() = user_id);
