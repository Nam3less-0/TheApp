import RankUpPanel, { RankUpPageWrap } from './Layout';
import { formatTeamMembers, TEAM_ACCENTS, teamTotalScore } from '../teams';
import { teamRoundStandingScore } from './TeamsRevealSummary';
import type { RankUpPlayer, RankUpTeam } from '../sync/types';

const PODIUM_STYLES = [
  { ring: 'border-[#D8B36A]/50', text: 'text-[#D8B36A]', label: '1st' },
  { ring: 'border-[#C3C9D1]/50', text: 'text-[#C3C9D1]', label: '2nd' },
  { ring: 'border-[#C08A5C]/50', text: 'text-[#C08A5C]', label: '3rd' },
] as const;

interface RoundRecapViewProps {
  players: RankUpPlayer[];
  teams?: RankUpTeam[];
  isTeamsGame?: boolean;
  roundNumber: number;
  roundPointsByPlayer: Record<string, number>;
  highlightPlayerId?: string | null;
  showHostActions?: boolean;
  onStartRound?: () => void;
  onLeave?: () => void;
}

export default function RoundRecapView({
  players,
  teams = [],
  isTeamsGame = false,
  roundNumber,
  roundPointsByPlayer,
  highlightPlayerId = null,
  showHostActions = false,
  onStartRound,
  onLeave,
}: RoundRecapViewProps) {
  if (isTeamsGame && teams.length >= 2) {
    const roundStandings = teams
      .map((team) => ({
        team,
        roundPoints: teamRoundStandingScore(players, team.id, roundPointsByPlayer),
        total: teamTotalScore(players, team.id),
      }))
      .sort((a, b) => b.roundPoints - a.roundPoints || b.total - a.total);

    const podium = roundStandings.slice(0, 2);

    return (
      <RankUpPageWrap variant="display">
        <header className="mb-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
            Round {roundNumber} complete
          </p>
          <h1 className="mt-1 font-display text-[28px] font-extrabold text-text-hi sm:text-[32px]">
            Round recap
          </h1>
          <p className="mt-2 font-body text-sm text-text-mid">
            Team points this round — then cumulative team totals.
          </p>
        </header>

        <RankUpPanel compact className="mb-6">
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            This round
          </p>
          <div className="flex items-end justify-center gap-5">
            {podium.map(({ team, roundPoints }, index) => {
              const style = PODIUM_STYLES[index] ?? PODIUM_STYLES[1]!;
              const accent = TEAM_ACCENTS[team.accent];
              const heightClass = index === 0 ? 'h-28' : 'h-24';

              return (
                <div key={team.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`flex w-[120px] flex-col items-center justify-end rounded-2xl border px-2 pb-3 pt-4 ${style.ring} ${heightClass}`}
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(36,34,40,0.9), rgba(28,26,32,0.95))',
                    }}
                  >
                    <span className={`font-mono text-[10px] uppercase ${style.text}`}>
                      {style.label}
                    </span>
                    <p className={`mt-1 font-mono text-[10px] uppercase ${accent.text}`}>
                      {team.name}
                    </p>
                    <p className="mt-1 max-w-full truncate px-1 font-body text-xs font-bold text-text-hi">
                      {formatTeamMembers(team, players)}
                    </p>
                    <p className={`mt-1 font-display text-xl font-extrabold ${style.text}`}>
                      +{roundPoints}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </RankUpPanel>

        <RankUpPanel compact className="mb-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            Overall team standings
          </p>
          <ol className="flex flex-col gap-2">
            {roundStandings.map(({ team, total }, index) => {
              const accent = TEAM_ACCENTS[team.accent];
              const members = players.filter((player) => player.teamId === team.id);

              return (
                <li
                  key={team.id}
                  className={`rounded-xl border px-4 py-3 ${accent.border}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`font-mono text-[10px] uppercase ${accent.text}`}>
                        #{index + 1} · {team.name}
                      </p>
                      <p className="mt-1 font-body text-sm font-bold text-text-hi">
                        {formatTeamMembers(team, players)}
                      </p>
                      <p className="mt-1 font-body text-[12px] text-text-mid">
                        {members
                          .map(
                            (player) =>
                              `${player.name}${highlightPlayerId === player.id ? ' (you)' : ''}: ${player.score}`,
                          )
                          .join(' · ')}
                      </p>
                    </div>
                    <span className="font-display text-xl font-extrabold text-text-hi">{total}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </RankUpPanel>

        {renderActions()}
      </RankUpPageWrap>
    );
  }

  const roundStandings = players
    .map((player) => ({
      player,
      roundPoints: roundPointsByPlayer[player.id] ?? 0,
    }))
    .sort((a, b) => b.roundPoints - a.roundPoints || b.player.score - a.player.score);

  const podium = roundStandings.slice(0, 3);
  const cumulative = [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return (
    <RankUpPageWrap variant="display">
      <header className="mb-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
          Round {roundNumber} complete
        </p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold text-text-hi sm:text-[32px]">
          Round recap
        </h1>
        <p className="mt-2 font-body text-sm text-text-mid">
          Points earned this round — then cumulative standings.
        </p>
      </header>

      <RankUpPanel compact className="mb-6">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          This round
        </p>
        <div className="flex items-end justify-center gap-3 sm:gap-5">
          {podium.map(({ player, roundPoints }, index) => {
            const style = PODIUM_STYLES[index]!;
            const heightClass = index === 0 ? 'h-28' : index === 1 ? 'h-24' : 'h-20';

            return (
              <div key={player.id} className="flex flex-col items-center gap-2">
                <div
                  className={`flex w-[88px] flex-col items-center justify-end rounded-2xl border px-2 pb-3 pt-4 ${style.ring} ${heightClass}`}
                  style={{
                    background: 'linear-gradient(180deg, rgba(36,34,40,0.9), rgba(28,26,32,0.95))',
                  }}
                >
                  <span className={`font-mono text-[10px] uppercase ${style.text}`}>
                    {style.label}
                  </span>
                  <p className="mt-1 max-w-full truncate font-body text-sm font-bold text-text-hi">
                    {player.name}
                  </p>
                  <p className={`mt-1 font-display text-xl font-extrabold ${style.text}`}>
                    +{roundPoints}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </RankUpPanel>

      <RankUpPanel compact className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Overall standings
        </p>
        <ol className="flex flex-col gap-2">
          {cumulative.map((player, index) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-line px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-xs text-text-low">{index + 1}</span>
                <span className="truncate font-body text-sm font-semibold text-text-hi">
                  {player.name}
                  {highlightPlayerId && player.id === highlightPlayerId ? ' (you)' : ''}
                </span>
              </div>
              <span className="font-mono text-sm text-pewter">{player.score}</span>
            </li>
          ))}
        </ol>
      </RankUpPanel>

      {renderActions()}
    </RankUpPageWrap>
  );

  function renderActions() {
    if (showHostActions || onLeave) {
      return (
        <div className="flex flex-col gap-3">
          {showHostActions && onStartRound ? (
            <button
              type="button"
              onClick={onStartRound}
              className="w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FA3C4] disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: 'linear-gradient(180deg, #8BB8D4, #6FA3C4 55%, #4E7F9C)',
              }}
            >
              Start Round {roundNumber + 1}
            </button>
          ) : (
            <RankUpPanel compact>
              <p className="text-center font-body text-sm text-text-mid">
                Waiting for host to start Round {roundNumber + 1}…
              </p>
            </RankUpPanel>
          )}

          {onLeave ? (
            <button
              type="button"
              onClick={onLeave}
              className="rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi"
            >
              Leave room
            </button>
          ) : null}
        </div>
      );
    }

    return (
      <RankUpPanel compact>
        <p className="text-center font-body text-sm text-text-mid">
          Waiting for the host to start Round {roundNumber + 1}…
        </p>
      </RankUpPanel>
    );
  }
}
