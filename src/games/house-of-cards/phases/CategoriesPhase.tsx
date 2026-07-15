import { TOPIC_POOL } from '../../../data/house-of-cards';
import { useHouseOfCards } from '../context';
import { SUITS, SUIT_META, isTopicPlayable } from '../deck';
import type { Suit } from '../types';
import {
  HocPageWrap,
  HocPanel,
  primaryButtonClass,
  primaryButtonStyle,
  secondaryButtonClass,
  secondaryButtonStyle,
} from '../components/Layout';

export default function CategoriesPhase() {
  const { state, dispatch } = useHouseOfCards();

  const lockedTopicIds = new Set(
    SUITS.filter((suit) => state.lockedSuits[suit])
      .map((suit) => state.suitTopicMap[suit].id)
      .filter(Boolean),
  );
  const openSuitCount = SUITS.filter((suit) => !state.lockedSuits[suit]).length;
  const eligibleCount = TOPIC_POOL.filter(isTopicPlayable).length;
  const availableForOpen = TOPIC_POOL.filter(
    (topic) => isTopicPlayable(topic) && !lockedTopicIds.has(topic.id),
  ).length;
  const canReroll = openSuitCount > 0 && availableForOpen >= openSuitCount;
  const canConfirm = state.deck.length === 52;
  const lockedCount = SUITS.length - openSuitCount;

  return (
    <HocPageWrap>
      <h1
        className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] sm:text-[30px]"
        style={{ color: 'var(--hoc-ivory)' }}
      >
        Tonight&apos;s categories
      </h1>
      <p className="mb-8 font-body text-sm" style={{ color: 'var(--hoc-ivory-dim)' }}>
        Lock any suit you want to keep, then reroll the rest. Question sets only lock in once
        you deal the cards.
      </p>

      <HocPanel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="font-body text-sm font-bold" style={{ color: 'var(--hoc-ivory)' }}>
            Suit lineup
          </p>
          <p className="font-mono text-[11px]" style={{ color: 'var(--hoc-ivory-dim)' }}>
            {eligibleCount} topics in the pool
            {lockedCount > 0 ? ` · ${lockedCount} locked` : ''}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {SUITS.map((suit) => (
            <CategorySuitRow
              key={suit}
              suit={suit}
              locked={state.lockedSuits[suit]}
              topicName={state.suitTopicMap[suit].name}
              setLabel={state.suitTopicMap[suit].setLabel}
              onToggleLock={() => dispatch({ type: 'TOGGLE_LOCK_SUIT', suit })}
            />
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => dispatch({ type: 'REROLL_CATEGORIES' })}
            disabled={!canReroll}
            className={`sm:flex-1 ${secondaryButtonClass}`}
            style={{
              ...secondaryButtonStyle,
              // @ts-expect-error CSS custom property for the focus ring colour
              '--tw-ring-color': 'var(--hoc-brass)',
            }}
          >
            {openSuitCount === SUITS.length
              ? 'Reroll categories'
              : `Reroll ${openSuitCount} open ${openSuitCount === 1 ? 'suit' : 'suits'}`}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'CONFIRM_CATEGORIES' })}
            disabled={!canConfirm}
            className={`sm:flex-1 ${primaryButtonClass}`}
            style={primaryButtonStyle}
          >
            Deal the cards
          </button>
        </div>

        {!canReroll && openSuitCount > 0 && (
          <p className="mt-3 text-center font-mono text-[10px]" style={{ color: 'var(--hoc-ivory-dim)' }}>
            Not enough unused topics left for the open suits
          </p>
        )}
        {openSuitCount === 0 && (
          <p className="mt-3 text-center font-mono text-[10px]" style={{ color: 'var(--hoc-ivory-dim)' }}>
            Unlock a suit to reroll it
          </p>
        )}
      </HocPanel>
    </HocPageWrap>
  );
}

function CategorySuitRow({
  suit,
  locked,
  topicName,
  setLabel,
  onToggleLock,
}: {
  suit: Suit;
  locked: boolean;
  topicName: string;
  setLabel: string;
  onToggleLock: () => void;
}) {
  const meta = SUIT_META[suit];
  const suitColor = meta.isRed ? 'var(--hoc-crimson-bright)' : 'var(--hoc-ivory)';

  return (
    <li
      className="flex items-center gap-3 rounded-xl border px-3.5 py-3"
      style={{
        borderColor: locked ? 'var(--hoc-brass)' : 'var(--hoc-line)',
        background: locked ? 'rgba(169, 133, 58, 0.08)' : 'var(--hoc-panel)',
      }}
    >
      <span className="text-xl leading-none" style={{ color: suitColor }} aria-hidden="true">
        {meta.symbol}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-body text-[15px] font-semibold leading-tight"
          style={{ color: 'var(--hoc-ivory)' }}
        >
          {topicName}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--hoc-ivory-dim)' }}>
          {meta.label} &middot; {setLabel} set
        </p>
      </div>
      <button
        type="button"
        onClick={onToggleLock}
        aria-pressed={locked}
        aria-label={`${locked ? 'Unlock' : 'Lock'} ${meta.label} (${topicName})`}
        className="shrink-0 rounded-lg border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2"
        style={{
          borderColor: locked ? 'var(--hoc-brass)' : 'var(--hoc-line-bright)',
          color: locked ? 'var(--hoc-brass)' : 'var(--hoc-ivory-dim)',
          background: locked ? 'rgba(169, 133, 58, 0.12)' : 'transparent',
          // @ts-expect-error CSS custom property for the focus ring colour
          '--tw-ring-color': 'var(--hoc-brass)',
        }}
      >
        {locked ? 'Locked' : 'Lock'}
      </button>
    </li>
  );
}
