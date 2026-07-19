import { useRankUp } from '../context';
import {
  formatTeamMembers,
  getOpposingTeam,
  getRankerTeammate,
  teamTotalScore,
} from '../teams';
import { perfectPoints, roundPointsLabel } from '../utils';
import RankUpPanel from './Layout';
import type { RankUpPlayer, RankUpTeam } from '../sync/types';

export function teamsRevealSummary(
  room: { rankerPlayerId: string | null; options: { length: number } },
  players: RankUpPlayer[],
  teams: RankUpTeam[],
): { headline: string; detail: string } {
  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  if (!ranker?.teamId) {
    return { headline: 'Round scored', detail: 'Team results are in.' };
  }

  const rankerTeam = teams.find((team) => team.id === ranker.teamId);
  const opposingTeam = getOpposingTeam(teams, ranker.teamId);
  const rankerTeamPoints =
    players.find((player) => player.teamId === ranker.teamId)?.lastRoundPoints ?? 0;
  const opposingPoints =
    players.find((player) => player.teamId === opposingTeam?.id)?.lastRoundPoints ?? 0;
  const perfect = perfectPoints(room.options.length);

  const rankerTeamLabel = rankerTeam ? formatTeamMembers(rankerTeam, players) : 'Ranker team';
  const opposingLabel = opposingTeam ? formatTeamMembers(opposingTeam, players) : 'Opposing team';

  if (rankerTeamPoints === perfect && opposingPoints === perfect) {
    return {
      headline: 'Both teams nailed it',
      detail: `${rankerTeamLabel} and ${opposingLabel} both hit perfect reads.`,
    };
  }

  if (rankerTeamPoints > opposingPoints) {
    return {
      headline: `${rankerTeamLabel} read the mind!`,
      detail: `${roundPointsLabel(rankerTeamPoints, room.options.length)} · ${opposingLabel} ${roundPointsLabel(opposingPoints, room.options.length).toLowerCase()}`,
    };
  }

  if (opposingPoints > rankerTeamPoints) {
    return {
      headline: `${opposingLabel} called it!`,
      detail: `${roundPointsLabel(opposingPoints, room.options.length)} · ${rankerTeamLabel} ${roundPointsLabel(rankerTeamPoints, room.options.length).toLowerCase()}`,
    };
  }

  return {
    headline: 'Even this turn',
    detail: `${rankerTeamLabel} and ${opposingLabel} split the points.`,
  };
}

export function TeamsRevealSummaryPanel() {
  const { room, players, teams } = useRankUp();

  if (!room) return null;

  const summary = teamsRevealSummary(room, players, teams);
  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const teammate = getRankerTeammate(players, room.rankerPlayerId);
  const opposingTeam = getOpposingTeam(teams, ranker?.teamId ?? null);
  const rankerTeam = teams.find((team) => team.id === ranker?.teamId);

  return (
    <RankUpPanel compact className="mb-6 border-[#6FA3C4]/25">
      <p className="text-center font-display text-xl font-extrabold text-text-hi">{summary.headline}</p>
      <p className="mt-2 text-center font-body text-sm text-text-mid">{summary.detail}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rankerTeam ? (
          <div className="rounded-xl border border-[#6FA3C4]/30 px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6FA3C4]">
              Ranker side
            </p>
            <p className="mt-1 font-body text-sm font-semibold text-text-hi">
              {teammate?.name ?? 'Teammate'} solo guess
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-[#6FA3C4]">
              +{players.find((player) => player.teamId === rankerTeam.id)?.lastRoundPoints ?? 0}
            </p>
          </div>
        ) : null}
        {opposingTeam ? (
          <div className="rounded-xl border border-copper/30 px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-copper">
              Opposing team
            </p>
            <p className="mt-1 font-body text-sm font-semibold text-text-hi">
              {formatTeamMembers(opposingTeam, players)} joint guess
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-copper">
              +{players.find((player) => player.teamId === opposingTeam.id)?.lastRoundPoints ?? 0}
            </p>
          </div>
        ) : null}
      </div>
    </RankUpPanel>
  );
}

export function teamRoundStandingScore(
  players: RankUpPlayer[],
  teamId: string,
  roundPointsByPlayer: Record<string, number>,
): number {
  const members = players.filter((player) => player.teamId === teamId);
  if (members.length === 0) return 0;
  return roundPointsByPlayer[members[0]!.id] ?? 0;
}

export { teamTotalScore };
