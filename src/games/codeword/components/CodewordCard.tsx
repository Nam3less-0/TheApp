import type { TeamCard } from '../types';

interface CodewordCardProps {
  card: TeamCard;
  compact?: boolean;
}

const COPPER = '#C99A7A';

export default function CodewordCard({ card, compact = false }: CodewordCardProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2" aria-label="Your codeword reference">
        {card.words.map((entry, i) => (
          <div
            key={entry.id}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold text-void"
              style={{ backgroundColor: COPPER }}
            >
              {i + 1}
            </span>
            <span className="truncate font-body text-sm font-semibold text-text-hi">
              {entry.word}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2.5" aria-label="Your secret codeword card">
      {card.words.map((entry, i) => (
        <div
          key={entry.id}
          className="flex items-center gap-3.5 rounded-xl border px-4 py-3"
          style={{
            borderColor: 'rgba(201,154,122,0.35)',
            background:
              'linear-gradient(135deg, rgba(201,154,122,0.10), rgba(26,28,32,0.6))',
          }}
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg font-extrabold text-void"
            style={{ backgroundColor: COPPER }}
          >
            {i + 1}
          </span>
          <span className="truncate font-display text-xl font-bold text-text-hi">
            {entry.word}
          </span>
        </div>
      ))}
    </div>
  );
}
