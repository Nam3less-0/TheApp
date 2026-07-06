import { useHouseOfCards } from '../context';
import { SUIT_META } from '../deck';
import { HocPageWrap, HocPanel } from '../components/Layout';

export default function RevealPhase() {
  const { state, dispatch } = useHouseOfCards();

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
          Table verdict &middot; scoring {activeName}
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
          className="mb-4 font-display text-lg font-bold leading-snug"
          style={{ color: 'var(--hoc-ivory-dim)' }}
        >
          {card.question}
        </p>

        <div
          className="rounded-lg border px-4 py-4"
          style={{ borderColor: 'var(--hoc-line-bright)', background: 'var(--hoc-onyx)' }}
        >
          <p
            className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--hoc-brass)' }}
          >
            Answer
          </p>
          <p
            className="font-display text-xl font-extrabold leading-snug"
            style={{ color: 'var(--hoc-ivory)' }}
          >
            {card.answer}
          </p>
        </div>
      </HocPanel>

      <p
        className="mt-5 text-center font-body text-sm"
        style={{ color: 'var(--hoc-ivory-dim)' }}
      >
        Did <span className="font-semibold" style={{ color: 'var(--hoc-brass)' }}>{activeName}</span>{' '}
        get it right? The table decides.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'JUDGE', correct: true })}
          className="flex min-h-14 items-center justify-center gap-2 rounded-xl border px-4 py-4 font-body text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:active:scale-[0.99]"
          style={{
            borderColor: 'var(--hoc-good)',
            background: 'rgba(111,207,151,0.12)',
            color: 'var(--hoc-good)',
          }}
        >
          <span aria-hidden="true">&#10003;</span>
          Correct &nbsp;+{card.value}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'JUDGE', correct: false })}
          className="flex min-h-14 items-center justify-center gap-2 rounded-xl border px-4 py-4 font-body text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:active:scale-[0.99]"
          style={{
            borderColor: 'var(--hoc-bad)',
            background: 'rgba(224,122,95,0.12)',
            color: 'var(--hoc-bad)',
          }}
        >
          <span aria-hidden="true">&#10007;</span>
          Incorrect &nbsp;&minus;{card.value}
        </button>
      </div>
    </HocPageWrap>
  );
}
