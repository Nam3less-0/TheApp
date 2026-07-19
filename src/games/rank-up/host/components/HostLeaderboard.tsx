import { useMemo } from 'react';
import { useRankUpHost } from '../context';
import RankUpPanel from '../../components/Layout';
import { CrownIcon } from '../../components/RankUpIcons';

const RANK_STYLES = [
  { badge: 'text-[#D8B36A]', ring: 'border-[#D8B36A]/40' },
  { badge: 'text-[#C3C9D1]', ring: 'border-[#C3C9D1]/35' },
  { badge: 'text-[#C08A5C]', ring: 'border-[#C08A5C]/35' },
] as const;

interface HostLeaderboardProps {
  variant?: 'sidebar' | 'hero';
}

export default function HostLeaderboard({ variant = 'sidebar' }: HostLeaderboardProps) {
  const { room, players, roundNumber } = useRankUpHost();
  const hero = variant === 'hero';

  const standings = useMemo(
    () => [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [players],
  );

  const showTurnDelta = room?.phase === 'reveal';
  const turnLabel =
    room && room.turnOrder.length > 0
      ? `Round ${roundNumber} · Turn ${room.turnIndex + 1} of ${room.turnOrder.length}`
      : `Round ${roundNumber}`;

  return (
    <RankUpPanel
      compact={!hero}
      className={`border-[#6FA3C4]/30 ${hero ? 'mx-auto max-w-3xl p-6 sm:p-8' : ''}`}
    >
      <div className={hero ? 'mb-6 text-center' : 'mb-4'}>
        <p
          className={`font-mono uppercase tracking-[0.16em] text-[#6FA3C4] ${
            hero ? 'text-xs sm:text-sm' : 'text-[10px]'
          }`}
        >
          Leaderboard
        </p>
        <p
          className={`mt-1 font-mono uppercase tracking-[0.12em] text-text-low ${
            hero ? 'text-[11px] sm:text-xs' : 'text-[10px]'
          }`}
        >
          {turnLabel}
        </p>
      </div>

      {standings.length === 0 ? (
        <p className="text-center font-body text-sm text-text-mid">Waiting for players…</p>
      ) : (
        <ol className={`flex flex-col ${hero ? 'gap-3 sm:gap-4' : 'gap-2'}`}>
          {standings.map((player, index) => {
            const isRanker = player.id === room?.rankerPlayerId;
            const rankStyle = RANK_STYLES[index] ?? { badge: 'text-text-mid', ring: 'border-line' };

            return (
              <li
                key={player.id}
                className={`flex items-center gap-3 rounded-xl border ${
                  hero ? 'px-4 py-4 sm:px-5 sm:py-5' : 'px-3 py-3'
                } ${isRanker ? 'border-pewter/50 bg-surface/80' : rankStyle.ring}`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full border border-line bg-deep/70 font-mono font-bold ${rankStyle.badge} ${
                    hero ? 'h-11 w-11 text-base sm:h-12 sm:w-12' : 'h-8 w-8 text-xs'
                  }`}
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isRanker ? (
                      <CrownIcon className={`shrink-0 text-pewter ${hero ? 'h-5 w-5' : 'h-3.5 w-3.5'}`} />
                    ) : null}
                    <p
                      className={`truncate font-bold text-text-hi ${
                        hero ? 'font-display text-xl sm:text-2xl' : 'font-body text-sm'
                      }`}
                    >
                      {player.name}
                    </p>
                  </div>
                  <p
                    className={`font-mono uppercase tracking-wider text-text-low ${
                      hero ? 'mt-1 text-[11px] sm:text-xs' : 'text-[10px]'
                    }`}
                  >
                    {isRanker ? 'Ranker' : 'Guesser'}
                    {showTurnDelta && player.lastRoundPoints != null
                      ? ` · +${player.lastRoundPoints} this turn`
                      : ''}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`font-display font-extrabold leading-none text-text-hi ${
                      hero ? 'text-4xl sm:text-5xl' : 'text-2xl'
                    }`}
                  >
                    {player.score}
                  </p>
                  <p
                    className={`mt-0.5 font-mono uppercase tracking-[0.12em] text-text-low ${
                      hero ? 'text-[10px]' : 'text-[9px]'
                    }`}
                  >
                    pts
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </RankUpPanel>
  );
}
