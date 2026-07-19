-- Delete multiplayer rooms automatically when the last participant leaves.
-- Each block is optional: skips games whose tables are not installed yet.

create or replace function public.delete_rank_up_room_if_empty()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.rank_up_players where room_code = old.room_code
  ) then
    delete from public.rank_up_rooms where code = old.room_code;
  end if;
  return old;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'rank_up_players'
  ) then
    drop trigger if exists rank_up_players_delete_empty_room on public.rank_up_players;
    create trigger rank_up_players_delete_empty_room
      after delete on public.rank_up_players
      for each row
      execute function public.delete_rank_up_room_if_empty();
  end if;
end $$;

create or replace function public.delete_codeword_room_if_empty()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.codeword_teams where room_code = old.room_code
  ) then
    delete from public.codeword_rooms where code = old.room_code;
  end if;
  return old;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'codeword_teams'
  ) then
    drop trigger if exists codeword_teams_delete_empty_room on public.codeword_teams;
    create trigger codeword_teams_delete_empty_room
      after delete on public.codeword_teams
      for each row
      execute function public.delete_codeword_room_if_empty();
  end if;
end $$;

create or replace function public.delete_imposter_room_if_empty()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.imposter_players where room_code = old.room_code
  ) then
    delete from public.imposter_rooms where code = old.room_code;
  end if;
  return old;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'imposter_players'
  ) then
    drop trigger if exists imposter_players_delete_empty_room on public.imposter_players;
    create trigger imposter_players_delete_empty_room
      after delete on public.imposter_players
      for each row
      execute function public.delete_imposter_room_if_empty();
  end if;
end $$;
