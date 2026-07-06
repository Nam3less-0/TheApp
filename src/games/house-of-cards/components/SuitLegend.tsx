import { SUITS, SUIT_META } from '../deck';
import type { Suit, SuitTopic } from '../types';

interface SuitLegendProps {
  suitTopicMap: Record<Suit, SuitTopic>;
}

export default function SuitLegend({ suitTopicMap }: SuitLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {SUITS.map((suit) => {
        const meta = SUIT_META[suit];
        const topic = suitTopicMap[suit];
        const suitColor = meta.isRed ? 'var(--hoc-crimson-bright)' : 'var(--hoc-ivory)';
        return (
          <div
            key={suit}
            className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
            style={{ borderColor: 'var(--hoc-line)', background: 'var(--hoc-panel)' }}
          >
            <span
              className="text-lg leading-none"
              style={{ color: suitColor }}
              aria-hidden="true"
            >
              {meta.symbol}
            </span>
            <div className="min-w-0">
              <p
                className="truncate font-body text-sm font-semibold leading-tight"
                style={{ color: 'var(--hoc-ivory)' }}
              >
                {topic.name}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-wide"
                style={{ color: 'var(--hoc-ivory-dim)' }}
              >
                {meta.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
