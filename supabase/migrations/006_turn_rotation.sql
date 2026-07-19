-- Full rotation rounds: turn order, round number, round recap phase

alter table public.rank_up_rooms
  add column turn_order jsonb not null default '[]'::jsonb,
  add column turn_index integer not null default 0,
  add column round_number integer not null default 1;

alter table public.rank_up_rooms drop constraint if exists rank_up_rooms_phase_check;

alter table public.rank_up_rooms
  add constraint rank_up_rooms_phase_check
  check (phase in ('lobby', 'display', 'guessing', 'reveal', 'round-recap'));

alter table public.rank_up_players drop constraint if exists rank_up_players_last_round_points_check;

alter table public.rank_up_players
  add constraint rank_up_players_last_round_points_check
  check (last_round_points is null or last_round_points between 0 and 3);
