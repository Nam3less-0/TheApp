import { useState } from 'react';
import { useHouseOfCards } from '../context';
import { SUIT_META } from '../deck';
import QuestionTimer from '../components/QuestionTimer';
import {
  HocPageWrap,
  HocPanel,
  primaryButtonClass,
  primaryButtonStyle,
} from '../components/Layout';

export default function QuestionPhase() {
  const { state, dispatch } = useHouseOfCards();
  const [confirmBack, setConfirmBack] = useState(false);

  if (state.activeCardIndex === null) return null;
  const card = state.deck[state.activeCardIndex];
  if (!card) return null;

  const meta = SUIT_META[card.suit];
  const suitColor = meta.isRed ? 'var(--hoc-crimson-bright)' : 'var(--hoc-ivory)';
  const activeName = state.activeTeam === 'a' ? state.teamAName : state.teamBName;

  return (
    <HocPageWrap>
      <div className="mb-4 flex items-center justify-between">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: 'var(--hoc-brass)' }}
        >
          {activeName} &middot; on the clock
        </span>
        <span className="flex items-center gap-2">
          <span className="text-lg leading-none" style={{ color: suitColor }} aria-hidden="true">
            {meta.symbol}
          </span>
          <span
            className="rounded-full border px-3 py-1 font-display text-sm font-bold tabular-nums"
            style={{ borderColor: 'var(--hoc-line-bright)', color: 'var(--hoc-ivory)' }}
          >
            {card.rank} &middot; {card.value} pts
          </span>
        </span>
      </div>

      <HocPanel>
        <p
          className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: 'var(--hoc-ivory-dim)' }}
        >
          {card.topicName}
        </p>
        <p
          className="mb-6 font-display text-xl font-bold leading-snug sm:text-2xl"
          style={{ color: 'var(--hoc-ivory)' }}
        >
          {card.question}
        </p>

        <div className="mb-6">
          <QuestionTimer durationSeconds={15 + card.value} />
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'REVEAL' })}
          className={primaryButtonClass}
          style={primaryButtonStyle}
        >
          Reveal Answer
        </button>
      </HocPanel>

      <div className="mt-4 text-center">
        {confirmBack ? (
          <div className="flex flex-col items-center gap-2">
            <p className="font-body text-sm" style={{ color: 'var(--hoc-ivory-dim)' }}>
              Put this card back and pick a different one? Your turn won&apos;t change.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: 'PUT_BACK' })}
                className="rounded-lg border px-4 py-2 font-body text-sm font-semibold focus-visible:outline-none focus-visible:ring-2"
                style={{ borderColor: 'var(--hoc-line-bright)', color: 'var(--hoc-ivory)' }}
              >
                Yes, put it back
              </button>
              <button
                type="button"
                onClick={() => setConfirmBack(false)}
                className="rounded-lg px-4 py-2 font-body text-sm"
                style={{ color: 'var(--hoc-ivory-dim)' }}
              >
                Keep playing it
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmBack(true)}
            className="font-mono text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2"
            style={{ color: 'var(--hoc-ivory-dim)' }}
          >
            Misclick? Put this card back
          </button>
        )}
      </div>
    </HocPageWrap>
  );
}
