-- Codeword two-team multiplayer rooms (run in Supabase SQL editor or via CLI)

create table if not exists public.codeword_rooms (
  code text primary key,
  phase text not null default 'lobby'
    check (phase in ('lobby', 'setup', 'playing', 'over')),
  host_team_id text not null,
  transmitting_team_id text,
  current_round integer not null default 1,
  winner_team_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.codeword_teams (
  id text primary key,
  room_code text not null references public.codeword_rooms (code) on delete cascade,
  name text not null,
  slot smallint not null check (slot in (1, 2)),
  misses integer not null default 0,
  intercepts integer not null default 0,
  card_locked boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (room_code, slot)
);

create index if not exists codeword_teams_room_code_idx
  on public.codeword_teams (room_code);

alter table public.codeword_rooms enable row level security;
alter table public.codeword_teams enable row level security;

-- Party-game trust model: room code is the access gate.
create policy "codeword_rooms_anon_all"
  on public.codeword_rooms for all
  using (true) with check (true);

create policy "codeword_teams_anon_all"
  on public.codeword_teams for all
  using (true) with check (true);

alter publication supabase_realtime add table public.codeword_rooms;
alter publication supabase_realtime add table public.codeword_teams;
