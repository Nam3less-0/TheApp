import { SUIT_META } from '../deck';
import type { CardState } from '../types';

interface CardTileProps {
  card: CardState;
  /** True when the card can't be picked (already used, or not the active team's turn). */
  disabled: boolean;
  onPick: () => void;
}

const cardSizeClass =
  'w-[6.75rem] shrink-0 sm:w-28 md:w-[7.75rem]';

export default function CardTile({ card, disabled, onPick }: CardTileProps) {
  const meta = SUIT_META[card.suit];
  const suitColor = meta.isRed ? 'var(--hoc-crimson-bright)' : 'var(--hoc-ivory)';

  if (card.used) {
    const isCorrect = card.result === 'correct';
    return (
      <div
        className={`relative flex aspect-[5/7] flex-col items-center justify-center rounded-xl border opacity-45 ${cardSizeClass}`}
        style={{
          borderColor: 'var(--hoc-line)',
          background: 'var(--hoc-panel)',
        }}
        aria-label={`${card.rank} of ${meta.label}, used, ${isCorrect ? 'correct' : 'incorrect'}`}
      >
        <span
          className="font-display text-xl font-bold leading-none sm:text-2xl"
          style={{ color: suitColor }}
        >
          {card.rank}
        </span>
        <span className="mt-1.5 text-2xl leading-none sm:text-3xl" style={{ color: suitColor }}>
          {meta.symbol}
        </span>
        <span
          className="mt-2 font-mono text-xs font-bold uppercase leading-none tracking-wide"
          style={{ color: isCorrect ? 'var(--hoc-good)' : 'var(--hoc-bad)' }}
        >
          {isCorrect ? '\u2713 +' : '\u2717 \u2212'}
          {card.value}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      aria-label={`Pick the ${card.rank} of ${meta.label}, worth ${card.value} points`}
      className={`hoc-card-flip group relative flex aspect-[5/7] flex-col items-center justify-center rounded-xl border transition-[transform,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:enabled:hover:-translate-y-1 ${cardSizeClass}`}
      style={{
        borderColor: 'var(--hoc-line-bright)',
        background:
          'linear-gradient(150deg, var(--hoc-panel-raised) 0%, var(--hoc-panel) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        // @ts-expect-error CSS custom property for the focus ring colour
        '--tw-ring-color': 'var(--hoc-brass)',
      }}
    >
      <span
        className="font-display text-xl font-bold leading-none sm:text-2xl md:text-3xl"
        style={{ color: suitColor }}
      >
        {card.rank}
      </span>
      <span
        className="mt-1.5 text-2xl leading-none sm:text-3xl md:text-4xl"
        style={{ color: suitColor }}
      >
        {meta.symbol}
      </span>
    </button>
  );
}
