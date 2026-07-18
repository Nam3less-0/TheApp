-- Store guess orders for automatic scoring after reveal

alter table public.rank_up_players
  add column if not exists guess_order jsonb,
  add column if not exists last_round_points integer
    check (last_round_points is null or last_round_points in (0, 1, 3));
