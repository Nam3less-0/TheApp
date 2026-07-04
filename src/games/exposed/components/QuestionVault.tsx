import { useEffect, useRef, useState } from 'react';

interface QuestionVaultProps {
  question: string;
  onPeek?: () => void;
  className?: string;
}

const ACCENT = '#9BC53D';

/**
 * Hold-to-peek panel sized for a full sentence rather than a single word
 * (mirrors the shared RevealVault interaction used by Imposter/Codeword).
 */
export default function QuestionVault({ question, onPeek, className = '' }: QuestionVaultProps) {
  const [peeking, setPeeking] = useState(false);
  const hasPeekedRef = useRef(false);

  function startPeek() {
    setPeeking(true);
    if (!hasPeekedRef.current) {
      hasPeekedRef.current = true;
      onPeek?.();
    }
  }

  function stopPeek() {
    setPeeking(false);
  }

  useEffect(() => {
    hasPeekedRef.current = false;
    setPeeking(false);
  }, [question]);

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Press and hold to reveal your question"
        className="flex min-h-[160px] w-full select-none items-center justify-center overflow-hidden rounded-2xl border px-5 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
        style={{
          touchAction: 'none',
          borderColor: peeking ? ACCENT : 'rgba(220,224,232,0.16)',
          background: peeking
            ? `radial-gradient(circle at 50% 40%, ${ACCENT}1f, #131417 70%)`
            : 'repeating-linear-gradient(-45deg, #1A1C20, #1A1C20 6px, #222428 6px, #222428 12px)',
          boxShadow: peeking
            ? `inset 0 2px 18px rgba(0,0,0,0.55), 0 0 0 1px ${ACCENT}33, 0 0 28px ${ACCENT}33`
            : 'inset 0 2px 12px rgba(0,0,0,0.4)',
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          startPeek();
        }}
        onPointerUp={stopPeek}
        onPointerLeave={stopPeek}
        onPointerCancel={stopPeek}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            startPeek();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') stopPeek();
        }}
        onBlur={stopPeek}
      >
        {peeking ? (
          <span
            className="break-words text-center font-display text-lg font-bold leading-snug sm:text-xl"
            style={{ color: ACCENT }}
          >
            {question}
          </span>
        ) : (
          <span
            className="select-none text-center font-display text-4xl font-extrabold text-text-low/70 blur-[10px]"
            aria-hidden="true"
          >
            ?????
          </span>
        )}
      </div>
      <p className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
        {peeking ? 'Release to hide' : 'Press & hold to read your question'}
      </p>
    </div>
  );
}
