import { motion } from 'framer-motion';
import type { RankUpPlayer } from '../sync/types';

interface PlayerAvatarChipProps {
  player: RankUpPlayer;
  submitted?: boolean;
  size?: 'sm' | 'md';
  showName?: boolean;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function PlayerAvatarChip({
  player,
  submitted = false,
  size = 'md',
  showName = true,
}: PlayerAvatarChipProps) {
  const dim = size === 'sm' ? 'h-9 w-9 text-[11px]' : 'h-11 w-11 text-xs';

  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-1.5"
      animate={{
        scale: submitted ? 1 : 0.92,
        opacity: submitted ? 1 : 0.45,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-full border font-mono font-bold transition-colors ${dim} ${
          submitted
            ? 'border-good/60 bg-good/15 text-good shadow-[0_0_12px_rgba(120,200,140,0.25)]'
            : 'border-line bg-surface/60 text-text-low'
        }`}
        title={player.name}
      >
        {initials(player.name)}
        {submitted ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-good text-[9px] text-void"
          >
            ✓
          </motion.span>
        ) : null}
      </div>
      {showName ? (
        <span
          className={`max-w-[4.5rem] truncate text-center font-body text-[10px] ${
            submitted ? 'font-semibold text-text-hi' : 'text-text-low'
          }`}
        >
          {player.name}
        </span>
      ) : null}
    </motion.div>
  );
}
