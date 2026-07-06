import { useEffect, useRef, useState } from 'react';

interface QuestionTimerProps {
  /** Total countdown length in seconds. Cosmetic pressure only. */
  durationSeconds: number;
}

/**
 * A purely cosmetic countdown bar. It never auto-advances the phase or blocks
 * the "Reveal Answer" action — when it hits zero it simply holds at empty.
 */
export default function QuestionTimer({ durationSeconds }: QuestionTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const startRef = useRef<number>(0);

  useEffect(() => {
    setRemaining(durationSeconds);
    startRef.current = performance.now();
    let frame = 0;

    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const left = Math.max(0, durationSeconds - elapsed);
      setRemaining(left);
      if (left > 0) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [durationSeconds]);

  const pct = durationSeconds > 0 ? (remaining / durationSeconds) * 100 : 0;
  const expired = remaining <= 0;
  const seconds = Math.ceil(remaining);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: 'var(--hoc-ivory-dim)' }}
        >
          {expired ? 'Time\u2019s up \u2014 reveal when ready' : 'Discuss'}
        </span>
        <span
          className="font-mono text-sm font-bold tabular-nums"
          style={{ color: expired ? 'var(--hoc-bad)' : 'var(--hoc-brass)' }}
        >
          {seconds}s
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--hoc-panel)' }}
        role="timer"
        aria-label={`${seconds} seconds remaining to discuss`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-linear"
          style={{
            width: `${pct}%`,
            background: expired
              ? 'var(--hoc-bad)'
              : 'linear-gradient(90deg, var(--hoc-brass), var(--hoc-crimson-bright))',
          }}
        />
      </div>
    </div>
  );
}
