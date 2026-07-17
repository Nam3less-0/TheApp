import type { Player } from '../types';
import PlayerAvatar from './PlayerAvatar';

interface ScoreboardProps {
  players: Player[];
  deltas?: Record<string, number>;
  saboteurId?: string;
  className?: string;
}

export default function Scoreboard({ players, deltas, saboteurId, className = '' }: ScoreboardProps) {
  const ranked = [...players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;

  return (
    <div className={className}>
      <div className="mb-2.5 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">Standings</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">Points</p>
      </div>
      <ul className="flex flex-col gap-2">
        {ranked.map((player, index) => {
          const isLeader = index === 0 && topScore > 0;
          const pct = topScore > 0 ? (player.score / topScore) * 100 : 0;
          const delta = deltas?.[player.id] ?? 0;
          const wasSaboteur = saboteurId === player.id;
          return (
            <li
              key={player.id}
              className={`relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2 ${
                isLeader ? 'border-[#8B6FD9]/50' : 'border-line'
              }`}
              style={{ background: 'rgba(26,28,32,0.6)' }}
            >
              <span
                className="pointer-events-none absolute inset-y-0 left-0"
                style={{
                  width: `${pct}%`,
                  background: isLeader
                    ? 'linear-gradient(90deg, rgba(139,111,217,0.28), rgba(139,111,217,0.05))'
                    : 'linear-gradient(90deg, rgba(220,224,232,0.10), transparent)',
                }}
                aria-hidden="true"
              />
              <span className="relative w-4 text-center font-mono text-xs text-text-low">{index + 1}</span>
              <PlayerAvatar name={player.name} size="sm" />
              <span className="relative min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">
                {player.name}
                {wasSaboteur && (
                  <span className="ml-1.5 rounded-full bg-[#E8A33D]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#E8A33D]">
                    Saboteur
                  </span>
                )}
              </span>
              {delta > 0 && (
                <span className="relative rounded-full bg-good/15 px-2 py-0.5 font-mono text-[10px] font-bold text-good">
                  +{delta}
                </span>
              )}
              <span
                className={`relative w-6 text-right font-display text-base font-bold tabular-nums ${
                  isLeader ? 'text-[#B39DFF]' : 'text-text-hi'
                }`}
              >
                {player.score}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
