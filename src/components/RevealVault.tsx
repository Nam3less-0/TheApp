import { useEffect, useRef, useState } from 'react';

interface RevealVaultProps {
  /** The secret word shown only while the user presses and holds. */
  word: string;
  /** Accent hex used for the border glow and revealed text. */
  accent?: string;
  /** Fired the first time the word is actually revealed. */
  onPeek?: () => void;
  /** Optional hint line override shown beneath the vault. */
  hint?: string;
  className?: string;
}

const DEFAULT_ACCENT = '#C2533B';
/** Fixed-length placeholder so concealed words never leak length via the blur. */
const CONCEALED_PLACEHOLDER = 'XKM?TQWZ';

/**
 * Shared hold-to-peek reveal used by pass-and-play games (Codeword, Imposter).
 * The word stays concealed by default and is only legible while the
 * user presses and holds, re-concealing the moment they release.
 */
export default function RevealVault({
  word,
  accent = DEFAULT_ACCENT,
  onPeek,
  hint,
  className = '',
}: RevealVaultProps) {
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

  // Reset the peek state if the secret word changes (next player / next round).
  useEffect(() => {
    hasPeekedRef.current = false;
    setPeeking(false);
  }, [word]);

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Press and hold to reveal your word"
        className="flex min-h-[140px] w-full select-none items-center justify-center overflow-hidden rounded-2xl border px-5 py-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
        style={{
          touchAction: 'none',
          borderColor: peeking ? accent : 'rgba(220,224,232,0.16)',
          background: peeking
            ? `radial-gradient(circle at 50% 40%, ${accent}1f, #131417 70%)`
            : 'repeating-linear-gradient(-45deg, #1A1C20, #1A1C20 6px, #222428 6px, #222428 12px)',
          boxShadow: peeking
            ? `inset 0 2px 18px rgba(0,0,0,0.55), 0 0 0 1px ${accent}33, 0 0 28px ${accent}33`
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
            className="break-words text-center font-display text-[2rem] font-extrabold leading-tight sm:text-[2.5rem]"
            style={{ color: accent }}
          >
            {word}
          </span>
        ) : (
          <span
            className="select-none whitespace-nowrap text-center font-display text-[2rem] font-extrabold leading-tight text-text-low/70 blur-[10px] sm:text-[2.5rem]"
            aria-hidden="true"
          >
            {CONCEALED_PLACEHOLDER}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
        {peeking ? 'Release to hide' : (hint ?? 'Press & hold to reveal your word')}
      </p>
    </div>
  );
}
