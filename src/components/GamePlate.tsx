import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { GameEntry } from '../types/game';
import { ArrowIcon } from '../icons/GameIcons';

const metalHex: Record<GameEntry['metal'], string> = {
  'steel-blue': '#6FA8DC',
  pewter: '#8B8F99',
  silver: '#C9CDD6',
  copper: '#C99A7A',
  ember: '#C2533B',
  gold: '#C9A44A',
  toxic: '#9BC53D',
  crimson: '#D6294A',
};

interface GamePlateProps {
  game: GameEntry;
}

function PlateContent({ game }: { game: GameEntry }) {
  const Icon = game.icon;
  const metal = metalHex[game.metal];
  const isPlayable = game.status === 'playable';

  return (
    <>
      {/* Machined top-edge highlight */}
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-line-bright to-transparent"
        aria-hidden="true"
      />

      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-line ${!isPlayable ? 'opacity-50' : ''}`}
        style={{
          backgroundColor: `color-mix(in srgb, ${metal} 12%, #222428)`,
          color: metal,
        }}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3
        className={`mb-1.5 font-display text-base font-semibold text-text-hi ${!isPlayable ? 'opacity-60' : ''}`}
      >
        {game.title}
      </h3>
      <p
        className={`mb-6 line-clamp-1 font-body text-sm text-text-mid ${!isPlayable ? 'opacity-60' : ''}`}
      >
        {game.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3">
        {isPlayable ? (
          <span className="rounded-full border border-line bg-surface-raised px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-steel-blue">
            Play
          </span>
        ) : (
          <span className="rounded-full border border-dashed border-text-low/40 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-text-low">
            In progress
          </span>
        )}

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-bright/30 text-text-hi transition-transform motion-safe:group-hover:translate-x-0.5 ${!isPlayable ? 'opacity-40' : ''}`}
          style={{ backgroundColor: `color-mix(in srgb, ${metal} 25%, #222428)` }}
          aria-hidden="true"
        >
          <ArrowIcon className="h-4 w-4" />
        </span>
      </div>
    </>
  );
}

export default function GamePlate({ game }: GamePlateProps) {
  const reducedMotion = useReducedMotion();
  const metal = metalHex[game.metal];
  const isPlayable = game.status === 'playable';

  const plateClasses = `
    group relative flex flex-col overflow-hidden rounded-tile border border-line p-6 text-left
    transition-[transform,box-shadow,border-color] duration-300
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--metal)] focus-visible:ring-offset-2 focus-visible:ring-offset-void
    ${isPlayable
      ? 'motion-safe:hover:-translate-y-[5px] hover:border-line-bright hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)] motion-reduce:hover:translate-y-0'
      : 'cursor-default opacity-80'
    }
  `;

  const plateStyle = {
    ['--metal' as string]: metal,
    background: 'linear-gradient(145deg, #222428 0%, #1A1C20 45%, #222428 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
  } as CSSProperties;

  const itemVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.4 },
    },
  };

  if (isPlayable) {
    return (
      <motion.div variants={itemVariants}>
        <Link
          to={`/play/${game.id}`}
          className={plateClasses}
          style={plateStyle}
          aria-label={`Play ${game.title}`}
        >
          <PlateContent game={game} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className={plateClasses}
      style={plateStyle}
      aria-disabled="true"
    >
      <PlateContent game={game} />
    </motion.div>
  );
}
