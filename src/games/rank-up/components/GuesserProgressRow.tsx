import { useRankUp } from '../context';
import PlayerAvatarChip from './PlayerAvatarChip';

interface GuesserProgressRowProps {
  showLabel?: boolean;
  className?: string;
}

export default function GuesserProgressRow({
  showLabel = true,
  className = '',
}: GuesserProgressRowProps) {
  const { room, players, submittedCount, guesserCount } = useRankUp();

  if (!room) return null;

  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);

  return (
    <div className={className}>
      {showLabel ? (
        <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-mid">
          Guesses locked — {submittedCount}/{guesserCount}
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
