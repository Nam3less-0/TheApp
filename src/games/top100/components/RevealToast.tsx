import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { RevealMessage, Top100State } from '../types';
import { getPlayerById } from '../utils';
import PlayerAvatar from './PlayerAvatar';
import { RankBadge } from './Top100Panel';

interface RevealToastProps {
  reveal: RevealMessage;
  state: Top100State;
  onDismiss: () => void;
}

export default function RevealToast({ reveal, state, onDismiss }: RevealToastProps) {
  const player = getPlayerById(state, reveal.playerId);

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 2400);
    return () => window.clearTimeout(timer);
  }, [reveal, onDismiss]);

  const isCorrect = reveal.type === 'correct';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)] ${
          isCorrect ? 'border-good/50' : 'border-bad/50'
        }`}
        style={{
          background: isCorrect
            ? 'linear-gradient(165deg, color-mix(in srgb, #7ED9A4 18%, #1A1E24), #16181C)'
            : 'linear-gradient(165deg, color-mix(in srgb, #E08B7A 18%, #1A1E24), #16181C)',
        }}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
          {player && (
            <PlayerAvatar name={player.name} size="md" ring />
          )}
          <div className="min-w-0 flex-1">
            {isCorrect ? (
              <>
                <p className="font-body text-sm font-bold text-good">Correct!</p>
                <p className="mt-0.5 truncate font-body text-[13px] text-text-hi">
                  {reveal.itemName}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {reveal.rank !== undefined && (
                    <RankBadge rank={reveal.rank} size="sm" />
                  )}
                  <span className="font-mono text-[12px] text-good">
                    +{reveal.points} pts → {player?.name}
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="font-body text-sm font-bold text-bad">Not on the list</p>
                <p className="mt-0.5 font-mono text-[12px] text-bad">
                  0 pts → {player?.name}
                </p>
              </>
            )}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
              isCorrect ? 'bg-good/15 text-good' : 'bg-bad/15 text-bad'
            }`}
            aria-hidden="true"
          >
            {isCorrect ? '✓' : '✕'}
          </motion.div>
        </div>
        <motion.div
          className={`h-0.5 origin-left ${isCorrect ? 'bg-good' : 'bg-bad'}`}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 2.4, ease: 'linear' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
