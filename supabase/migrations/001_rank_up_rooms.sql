-- Rank Up multiplayer rooms (run in Supabase SQL editor or via CLI)

create table if not exists public.rank_up_rooms (
  code text primary key,
  phase text not null default 'lobby'
    check (phase in ('lobby', 'display', 'guessing', 'reveal')),
  host_player_id text not null,
  ranker_player_id text,
  question_type text check (question_type in ('players', 'items')),
  prompt text,
  options jsonb not null default '[]'::jsonb,
  ranker_order jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rank_up_players (
  id text primary key,
  room_code text not null references public.rank_up_rooms (code) on delete cascade,
  name text not null,
  score integer not null default 0,
  guess_submitted boolean not null default false,
  joined_at timestamptz not null default now()
);

create index if not exists rank_up_players_room_code_idx
  on public.rank_up_players (room_code);

alter table public.rank_up_rooms enable row level security;
alter table public.rank_up_players enable row level security;

-- Party-game trust model: room code is the access gate.
create policy "rank_up_rooms_anon_all"
  on public.rank_up_rooms for all
  using (true) with check (true);

create policy "rank_up_players_anon_all"
  on public.rank_up_players for all
  using (true) with check (true);

alter publication supabase_realtime add table public.rank_up_rooms;
alter publication supabase_realtime add table public.rank_up_players;
