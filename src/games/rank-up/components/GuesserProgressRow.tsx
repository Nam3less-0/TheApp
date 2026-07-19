import { useRankUp } from '../context';
import PlayerAvatarChip from './PlayerAvatarChip';

interface GuesserProgressRowProps {
  showLabel?: boolean;
  className?: string;
  variant?: 'waiting' | 'locked';
}

export default function GuesserProgressRow({
  showLabel = true,
  className = '',
  variant = 'locked',
}: GuesserProgressRowProps) {
  const { room, players, submittedCount, guesserCount } = useRankUp();

  if (!room) return null;

  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);
  const allIn = guesserCount > 0 && submittedCount >= guesserCount;

  const label =
    variant === 'waiting'
      ? allIn
        ? `All guesses in — ${submittedCount}/${guesserCount}`
        : `Guesses coming in — ${submittedCount}/${guesserCount}`
      : `Guesses locked — ${submittedCount}/${guesserCount}`;

  return (
    <div className={className}>
      {showLabel ? (
        <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-mid">
          {label}
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-center gap-4">
        {guessers.map((player) => (
          <PlayerAvatarChip
            key={player.id}
            player={player}
            submitted={player.guessSubmitted}
          />
        ))}
      </div>
    </div>
  );
}
