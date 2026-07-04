import type { Player } from '../types';
import PlayerAvatar from './PlayerAvatar';

interface ScoreStripProps {
  players: Player[];
  currentPlayerId?: string;
  targetScore: number;
  className?: string;
}

export default function ScoreStrip({
  players,
  currentPlayerId,
  targetScore,
  className = '',
}: ScoreStripProps) {
  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {players.map((player) => {
        const isCurrent = player.id === currentPlayerId;
        const pct = Math.min(100, (player.score / targetScore) * 100);
        return (
          <div
            key={player.id}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 ${
              isCurrent ? 'border-silver/60' : 'border-line'
            }`}
            style={{ background: 'rgba(26,28,32,0.6)' }}
          >
            <PlayerAvatar name={player.name} size="sm" />
            <span className="max-w-full truncate font-body text-[11px] font-semibold text-text-hi">
              {player.name}
            </span>
            <span
              className={`font-display text-sm font-bold tabular-nums ${
                isCurrent ? 'text-silver-bright' : 'text-text-mid'
              }`}
            >
              {player.score}
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-silver"
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
