import { LOSE_THRESHOLD, WIN_THRESHOLD } from '../utils';

interface ScoreHeaderProps {
  misses: number;
  intercepts: number;
  className?: string;
}

function Dots({
  filled,
  total,
  color,
}: {
  filled: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-3 w-3 rounded-full border transition-colors"
          style={{
            borderColor: i < filled ? color : 'rgba(220,224,232,0.18)',
            backgroundColor: i < filled ? color : 'transparent',
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function ScoreHeader({
  misses,
  intercepts,
  className = '',
}: ScoreHeaderProps) {
  return (
    <div className={`mb-4 grid grid-cols-2 gap-2.5 ${className}`}>
      <div
        className="rounded-[14px] border border-line px-3.5 py-2.5"
        style={{ background: 'linear-gradient(165deg, #222428, #1A1C20)' }}
      >
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Our misses
        </p>
        <div className="flex items-center justify-between">
          <Dots filled={misses} total={LOSE_THRESHOLD} color="#E08B7A" />
          <span className="font-mono text-sm text-bad">
            {misses}/{LOSE_THRESHOLD}
          </span>
        </div>
      </div>

      <div
        className="rounded-[14px] border border-line px-3.5 py-2.5"
        style={{ background: 'linear-gradient(165deg, #222428, #1A1C20)' }}
      >
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Our intercepts
        </p>
        <div className="flex items-center justify-between">
          <Dots filled={intercepts} total={WIN_THRESHOLD} color="#7ED9A4" />
          <span className="font-mono text-sm text-good">
            {intercepts}/{WIN_THRESHOLD}
          </span>
        </div>
      </div>
    </div>
  );
}
