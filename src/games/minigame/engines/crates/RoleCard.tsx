import { useState } from 'react';
import { motion } from 'framer-motion';
import { ROLE_ACCENT, ROLE_LABEL, type CrateRole } from './logic';

const CONCEALED = 'XKM?TQWZ';

interface RoleCardProps {
  role: CrateRole;
  headline: string;
  detail: string;
  crates: string[];
}

/**
 * Press-and-hold reveal. Nothing sensitive renders until the pointer is down,
 * so a glance from across the table shows only static.
 */
export default function RoleCard({ role, headline, detail }: RoleCardProps) {
  const [peeking, setPeeking] = useState(false);
  const accent = ROLE_ACCENT[role];

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Press and hold to reveal your role"
        className="flex min-h-[190px] w-full select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 px-5 py-8 text-center transition-colors focus-visible:outline-none"
        style={{
          touchAction: 'none',
          borderColor: peeking ? accent : 'rgba(220,224,232,0.16)',
          background: peeking
            ? `radial-gradient(circle at 50% 30%, ${accent}26, #131417 72%)`
            : 'repeating-linear-gradient(-45deg, #1A1C20, #1A1C20 6px, #222428 6px, #222428 12px)',
          boxShadow: peeking
            ? `inset 0 2px 18px rgba(0,0,0,0.55), 0 0 26px -6px ${accent}`
            : 'inset 0 2px 12px rgba(0,0,0,0.4)',
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          setPeeking(true);
        }}
        onPointerUp={() => setPeeking(false)}
        onPointerLeave={() => setPeeking(false)}
        onPointerCancel={() => setPeeking(false)}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setPeeking(true);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') setPeeking(false);
        }}
        onBlur={() => setPeeking(false)}
      >
        {peeking ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ borderColor: `${accent}66`, color: accent }}
            >
              {ROLE_LABEL[role]}
            </span>
            <span className="max-w-full break-words font-display text-[20px] font-extrabold leading-tight text-text-hi sm:text-[23px]">
              {headline}
            </span>
            <span className="max-w-full break-words font-body text-[12.5px] leading-snug text-text-mid">
              {detail}
            </span>
          </motion.div>
        ) : (
          <span
            className="select-none whitespace-nowrap font-display text-[2rem] font-extrabold leading-tight text-text-low/70 blur-[10px] sm:text-[2.5rem]"
            aria-hidden="true"
          >
            {CONCEALED}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
        {peeking ? 'Release to hide' : 'Press & hold to reveal'}
      </p>
    </div>
  );
}
