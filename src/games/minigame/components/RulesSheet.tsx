import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MinigameEngine } from '../types';

/**
 * Small persistent "Rules" affordance for the play screen. These games have
 * enough moving parts that players need the manual mid-round, not just once
 * on the way in.
 */
export default function RulesSheet({ game }: { game: MinigameEngine }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Show the rules for ${game.title}`}
        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
        style={{ borderColor: `${game.accent}55`, color: game.accent, background: `${game.accent}12` }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M9.6 9.2a2.5 2.5 0 1 1 3.3 2.37c-.6.22-.9.72-.9 1.33v.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.6" r="1.05" fill="currentColor" />
        </svg>
        Rules
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-void/85 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex max-h-[86svh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-2xl border bg-surface sm:rounded-2xl"
              style={{ borderColor: `${game.accent}44` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center gap-2.5 border-b px-4 py-3.5"
                style={{ borderColor: 'rgba(220,224,232,0.12)', background: `${game.accent}10` }}
              >
                <span className="text-xl" aria-hidden="true">
                  {game.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-extrabold leading-tight text-text-hi">
                    {game.title}
                  </h2>
                  <p className="font-body text-[12px] text-text-mid">{game.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close rules"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-text-mid transition-colors hover:border-line-bright hover:text-text-hi"
                >
                  ✕
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
                  The setup
                </p>
                <p className="mb-4 font-body text-[13.5px] leading-relaxed text-text-hi">
                  {game.manual.premise}
                </p>

                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
                  How it works
                </p>
                <ol className="mb-4 flex flex-col gap-2.5">
                  {game.manual.howToPlay.map((step, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                        style={{ background: `${game.accent}22`, color: game.accent }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-body text-[13px] leading-snug text-text-mid">{step}</span>
                    </li>
                  ))}
                </ol>

                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-low">
                  Points
                </p>
                <ul className="flex flex-col gap-1.5">
                  {game.manual.scoring.map((line, i) => (
                    <li key={i} className="flex gap-2 font-body text-[13px] text-text-mid">
                      <span style={{ color: game.accent }}>&bull;</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
