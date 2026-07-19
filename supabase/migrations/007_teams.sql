-- Rank Up 2v2 teams mode

create table if not exists public.rank_up_teams (
  id text primary key,
  room_code text not null references public.rank_up_rooms (code) on delete cascade,
  name text not null,
  accent text not null check (accent in ('a', 'b'))
);

create index if not exists rank_up_teams_room_code_idx
  on public.rank_up_teams (room_code);

alter table public.rank_up_players
  add column if not exists team_id text references public.rank_up_teams (id) on delete set null;

alter table public.rank_up_rooms
  add column if not exists game_mode text not null default 'classic'
    check (game_mode in ('classic', 'teams')),
  add column if not exists team_draft_order jsonb;

alter table public.rank_up_teams enable row level security;

create policy "rank_up_teams_anon_all"
  on public.rank_up_teams for all
  using (true) with check (true);

alter publication supabase_realtime add table public.rank_up_teams;
