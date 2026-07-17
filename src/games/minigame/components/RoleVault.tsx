import { useEffect, useState } from 'react';
import type { Briefing } from '../types';
import { HAZARD, VIOLET } from './MinigamePanel';

const CONCEALED_PLACEHOLDER = 'XKM?TQWZ';

interface RoleVaultProps {
  briefing: Briefing;
  onPeek?: () => void;
}

/**
 * Press-and-hold reveal for a player's secret role + this round's private
 * briefing. Mirrors the app's shared RevealVault interaction so it feels
 * consistent, but renders a role badge + multi-line detail instead of a
 * single word.
 */
export default function RoleVault({ briefing, onPeek }: RoleVaultProps) {
  const [peeking, setPeeking] = useState(false);
  const [hasPeeked, setHasPeeked] = useState(false);
  const accent = briefing.role === 'SABOTEUR' ? HAZARD : VIOLET;

  useEffect(() => {
    setHasPeeked(false);
    setPeeking(false);
  }, [briefing.headline, briefing.role]);

  function start() {
    setPeeking(true);
    if (!hasPeeked) {
      setHasPeeked(true);
      onPeek?.();
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Press and hold to reveal your role"
        className="flex min-h-[170px] w-full select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border px-5 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2"
        style={{
          touchAction: 'none',
          borderColor: peeking ? accent : 'rgba(220,224,232,0.16)',
          background: peeking
            ? `radial-gradient(circle at 50% 35%, ${accent}22, #131417 70%)`
            : 'repeating-linear-gradient(-45deg, #1A1C20, #1A1C20 6px, #222428 6px, #222428 12px)',
          boxShadow: peeking
            ? `inset 0 2px 18px rgba(0,0,0,0.55), 0 0 0 1px ${accent}44, 0 0 28px ${accent}33`
            : 'inset 0 2px 12px rgba(0,0,0,0.4)',
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          start();
        }}
        onPointerUp={() => setPeeking(false)}
        onPointerLeave={() => setPeeking(false)}
        onPointerCancel={() => setPeeking(false)}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') setPeeking(false);
        }}
        onBlur={() => setPeeking(false)}
      >
        {peeking ? (
          <>
            <span
              className="rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ borderColor: `${accent}66`, color: accent }}
            >
              {briefing.role === 'SABOTEUR' ? 'You are the Saboteur' : 'You are a Builder'}
            </span>
            <span className="max-w-full break-words font-display text-[19px] font-extrabold leading-tight text-text-hi sm:text-[22px]">
              {briefing.headline}
            </span>
            {briefing.detail && (
              <span className="max-w-full break-words font-body text-[13px] leading-snug text-text-mid">
                {briefing.detail}
              </span>
            )}
          </>
        ) : (
          <span
            className="select-none whitespace-nowrap font-display text-[2rem] font-extrabold leading-tight text-text-low/70 blur-[10px] sm:text-[2.5rem]"
            aria-hidden="true"
          >
            {CONCEALED_PLACEHOLDER}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
        {peeking ? 'Release to hide' : 'Press & hold to reveal your role'}
      </p>
    </div>
  );
}
