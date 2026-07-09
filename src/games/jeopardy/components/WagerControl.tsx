import { useState } from 'react';
import { COLORS, SILVER_BUTTON, formatScore } from '../utils';

interface WagerControlProps {
  min: number;
  max: number;
  /** Initial value; defaults to min. */
  initial?: number;
  confirmLabel: string;
  onConfirm: (amount: number) => void;
  /** Optional context line, e.g. current score. */
  hint?: string;
}

const STEP = 100;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function WagerControl({
  min,
  max,
  initial,
  confirmLabel,
  onConfirm,
  hint,
}: WagerControlProps) {
  const [amount, setAmount] = useState<number>(
    clamp(initial ?? min, min, max),
  );

  const quick = [
    { label: 'Min', value: min },
    { label: 'Half', value: clamp(Math.round(max / 2 / STEP) * STEP, min, max) },
    { label: 'All in', value: max },
  ];

  return (
    <div>
      {hint && (
        <p className="mb-3 text-center font-mono text-[11px] text-text-low">{hint}</p>
      )}

      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setAmount((a) => clamp(a - STEP, min, max))}
          disabled={amount <= min}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-line font-display text-xl font-bold text-text-hi transition-colors hover:border-steel-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Decrease wager"
        >
          −
        </button>
        <div
          className="min-w-[140px] rounded-xl border px-4 py-2.5 text-center font-display text-2xl font-black tabular-nums"
          style={{ borderColor: `color-mix(in srgb, ${COLORS.gold} 45%, transparent)`, color: COLORS.goldBright }}
        >
          {formatScore(amount)}
        </div>
        <button
          type="button"
          onClick={() => setAmount((a) => clamp(a + STEP, min, max))}
          disabled={amount >= max}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-line font-display text-xl font-bold text-text-hi transition-colors hover:border-steel-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Increase wager"
        >
          +
        </button>
      </div>

      <div className="mb-3">
        <input
          type="range"
          min={min}
          max={max}
          step={STEP}
          value={amount}
          onChange={(e) => setAmount(clamp(Number(e.target.value), min, max))}
          className="w-full accent-[var(--jeo-gold)]"
          style={{ ['--jeo-gold' as string]: COLORS.gold }}
          aria-label="Wager amount"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-text-low">
          <span>{formatScore(min)}</span>
          <span>{formatScore(max)}</span>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {quick.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => setAmount(clamp(q.value, min, max))}
            className="flex-1 rounded-lg border border-line px-2 py-2 font-mono text-[11px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            {q.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onConfirm(clamp(amount, min, max))}
        className="w-full rounded-xl border-none px-4 py-3.5 font-body text-sm font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
        style={{ background: SILVER_BUTTON }}
      >
        {confirmLabel}
      </button>
    </div>
  );
}
