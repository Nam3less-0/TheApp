import { perfectPoints } from '../utils';
import type { RankOption } from '../types';

interface DifficultyBadgeProps {
  options: RankOption[];
  className?: string;
}

function starCount(itemCount: number): number {
  if (itemCount <= 3) return 1;
  if (itemCount <= 5) return 2;
  return 3;
}

export default function DifficultyBadge({ options, className = '' }: DifficultyBadgeProps) {
  const itemCount = options.length;
  const payout = perfectPoints(itemCount);
  const stars = starCount(itemCount);

  return (
    <div
      className={`rounded-2xl border border-[#6FA3C4]/25 px-4 py-3 ${className}`}
      style={{
        background: 'linear-gradient(165deg, rgba(111,163,196,0.12), rgba(28,26,32,0.6))',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
            Difficulty
          </p>
          <p className="mt-1 flex items-center gap-0.5" aria-label={`${stars} of 3 stars`}>
            {Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                className={`text-sm ${index < stars ? 'text-[#D8B36A]' : 'text-text-low/40'}`}
              >
                ★
              </span>
            ))}
          </p>
        </div>
        <p className="font-body text-[13px] font-semibold text-text-hi">
          Perfect match pays{' '}
          <span className="font-mono text-[#D8B36A]">+{payout}</span> pts
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.slice(0, 6).map((option) => (
          <span
            key={option.id}
            className="rounded-full border border-line bg-deep/60 px-2.5 py-0.5 font-body text-[11px] text-text-mid"
          >
            {option.label}
          </span>
        ))}
        {options.length > 6 ? (
          <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-text-low">
            +{options.length - 6}
          </span>
        ) : null}
      </div>
    </div>
  );
}
