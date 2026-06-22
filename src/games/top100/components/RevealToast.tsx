import { useEffect } from 'react';
import type { RevealMessage, Top100State } from '../types';
import { getPlayerById } from '../utils';

interface RevealToastProps {
  reveal: RevealMessage;
  state: Top100State;
  onDismiss: () => void;
}

export default function RevealToast({ reveal, state, onDismiss }: RevealToastProps) {
  const player = getPlayerById(state, reveal.playerId);

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 2200);
    return () => window.clearTimeout(timer);
  }, [reveal, onDismiss]);

  const isCorrect = reveal.type === 'correct';

  if (isCorrect) {
    return (
      <div
        className="mt-4 flex items-center justify-between rounded-xl border border-good px-4 py-3.5"
        style={{
          background:
            'linear-gradient(165deg, color-mix(in srgb, #7ED9A4 14%, #1A1C20), #1A1C20)',
        }}
        role="status"
        aria-live="polite"
      >
        <span className="font-body text-sm font-bold text-good">
          Correct — {reveal.itemName}, rank {reveal.rank}
        </span>
        <span className="font-mono text-[13px] text-good">
          +{reveal.points} pts → {player?.name}
        </span>
      </div>
    );
  }

  return (
    <div
      className="mt-4 flex items-center justify-between rounded-xl border border-bad px-4 py-3.5"
      style={{
        background:
          'linear-gradient(165deg, color-mix(in srgb, #E08B7A 14%, #1A1C20), #1A1C20)',
      }}
      role="status"
      aria-live="polite"
    >
      <span className="font-body text-sm font-bold text-bad">Not on the list</span>
      <span className="font-mono text-[13px] text-bad">0 pts → {player?.name}</span>
    </div>
  );
}
