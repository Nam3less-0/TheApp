-- Imposter multiplayer rooms (run in Supabase SQL editor or via CLI)

create table if not exists public.imposter_rooms (
  code text primary key,
  phase text not null default 'lobby'
    check (phase in ('lobby', 'reveal', 'discuss', 'vote', 'redeem', 'result', 'final')),
  host_player_id text not null,
  total_rounds integer not null default 5,
  current_round integer not null default 0,
  current_bucket jsonb,
  current_mode text check (current_mode in ('standard', 'blank')),
  current_majority_word text,
  current_imposter_word text,
  current_imposter_player_id text,
  reveal_order jsonb not null default '[]'::jsonb,
  reveal_index integer not null default 0,
  reveal_ready_ids jsonb not null default '[]'::jsonb,
  voted_player_id text,
  remaining_buckets jsonb not null default '[]'::jsonb,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.imposter_players (
  id text primary key,
  room_code text not null references public.imposter_rooms (code) on delete cascade,
  name text not null,
  score integer not null default 0,
  current_word text,
  is_imposter boolean not null default false,
  joined_at timestamptz not null default now()
);

create index if not exists imposter_players_room_code_idx
  on public.imposter_players (room_code);

alter table public.imposter_rooms enable row level security;
alter table public.imposter_players enable row level security;

create policy "imposter_rooms_anon_all"
  on public.imposter_rooms for all
  using (true) with check (true);

create policy "imposter_players_anon_all"
  on public.imposter_players for all
  using (true) with check (true);

alter publication supabase_realtime add table public.imposter_rooms;
alter publication supabase_realtime add table public.imposter_players;
