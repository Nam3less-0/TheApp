import { shuffleIds } from './utils';
import type { RankUpPlayer, RankUpRoom, RankUpTeam } from './sync/types';

export const TEAMS_REQUIRED_PLAYERS = 4;

export function isTeamsMode(room: RankUpRoom | null | undefined): boolean {
  return room?.gameMode === 'teams';
}

export function isTeamFormationComplete(players: RankUpPlayer[], teams: RankUpTeam[]): boolean {
  if (players.length !== TEAMS_REQUIRED_PLAYERS || teams.length < 2) return false;

  const teamA = teams.find((team) => team.accent === 'a');
  const teamB = teams.find((team) => team.accent === 'b');
  if (!teamA || !teamB) return false;

  const countA = players.filter((player) => player.teamId === teamA.id).length;
  const countB = players.filter((player) => player.teamId === teamB.id).length;
  return countA === 2 && countB === 2;
}

export function buildTeamTurnOrder(teamA: string[], teamB: string[]): string[] {
  const a = shuffleIds([...teamA]);
  const b = shuffleIds([...teamB]);
  return [a[0]!, b[0]!, a[1]!, b[1]!];
}

export function getRankerTeammate(
  players: RankUpPlayer[],
  rankerId: string | null | undefined,
): RankUpPlayer | null {
  if (!rankerId) return null;
  const ranker = players.find((player) => player.id === rankerId);
  if (!ranker?.teamId) return null;
  return players.find((player) => player.teamId === ranker.teamId && player.id !== rankerId) ?? null;
}

export function getOpposingTeam(
  teams: RankUpTeam[],
  rankerTeamId: string | null | undefined,
): RankUpTeam | null {
  if (!rankerTeamId) return null;
  return teams.find((team) => team.id !== rankerTeamId) ?? null;
}

export type TeamsGuessRole = 'ranker' | 'solo-teammate' | 'joint-opposing' | 'waiting';

export function getTeamsGuessRole(
  room: RankUpRoom,
  players: RankUpPlayer[],
  teams: RankUpTeam[],
  playerId: string,
): TeamsGuessRole {
  if (room.rankerPlayerId === playerId) return 'ranker';

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const teammate = getRankerTeammate(players, room.rankerPlayerId);
  if (teammate?.id === playerId) return 'solo-teammate';

  const opposingTeam = getOpposingTeam(teams, ranker?.teamId ?? null);
  const me = players.find((player) => player.id === playerId);
  if (opposingTeam && me?.teamId === opposingTeam.id) return 'joint-opposing';

  return 'waiting';
}

export function teamTotalScore(players: RankUpPlayer[], teamId: string): number {
  return players
    .filter((player) => player.teamId === teamId)
    .reduce((sum, player) => sum + player.score, 0);
}

export function teamRoundPoints(
  players: RankUpPlayer[],
  teamId: string,
  roundPointsByPlayer: Record<string, number>,
): number {
  return players
    .filter((player) => player.teamId === teamId)
    .reduce((sum, player) => sum + (roundPointsByPlayer[player.id] ?? 0), 0);
}

export function formatTeamMembers(team: RankUpTeam, players: RankUpPlayer[]): string {
  const members = players.filter((player) => player.teamId === team.id);
  if (members.length === 0) return team.name;
  if (members.length === 1) return members[0]!.name;
  return `${members[0]!.name} & ${members[1]!.name}`;
}

export function teamsGuessProgress(
  room: RankUpRoom,
  players: RankUpPlayer[],
  teams: RankUpTeam[],
): { submittedCount: number; guesserCount: number } {
  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const teammate = getRankerTeammate(players, room.rankerPlayerId);
  const opposingTeam = getOpposingTeam(teams, ranker?.teamId ?? null);
  const opposingMembers = opposingTeam
    ? players.filter((player) => player.teamId === opposingTeam.id)
    : [];

  const teammateSubmitted = Boolean(teammate?.guessSubmitted);
  const opposingSubmitted = opposingMembers.some((player) => player.guessSubmitted);

  return {
    submittedCount: (teammateSubmitted ? 1 : 0) + (opposingSubmitted ? 1 : 0),
    guesserCount: 2,
  };
}

export const TEAM_ACCENTS = {
  a: {
    label: 'Team A',
    border: 'border-[#6FA3C4]/45',
    bg: 'bg-[#6FA3C4]/10',
    text: 'text-[#6FA3C4]',
    ring: 'ring-[#6FA3C4]/30',
  },
  b: {
    label: 'Team B',
    border: 'border-copper/45',
    bg: 'bg-copper/10',
    text: 'text-copper',
    ring: 'ring-copper/30',
  },
} as const;
