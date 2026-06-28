import { useEffect, useState } from 'react';
import { useBet } from '../context';
import ReelTrack from '../components/ReelTrack';
import BetTeamsPanel from '../components/BetTeamsPanel';
import { BetGoldButton, BetPageWrap } from '../components/BetLayout';

export default function BetCategories() {
  const { state, dispatch } = useBet();
  const [spinKey, setSpinKey] = useState(0);
  const roundNum = state.rounds.length + 1;

  const categories = state.drawnCategories;
  const selected = state.selectedCategoryIndex;
  const selectedCategory =
    selected !== null && categories ? categories[selected] : null;

  useEffect(() => {
    if (!categories) {
      dispatch({ type: 'DRAW_CATEGORIES' });
    }
  }, [dispatch, categories]);

  function handleRespin() {
    dispatch({ type: 'DRAW_CATEGORIES' });
    setSpinKey((k) => k + 1);
  }

  return (
    <BetPageWrap wide>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-low opacity-40">
        Round {String(roundNum).padStart(2, '0')}
      </p>
      <h1 className="mb-2 font-display text-[22px] font-extrabold text-text-hi sm:text-[26px]">
        Draw a category
      </h1>
      <p className="mb-6 font-body text-sm text-text-mid">
        Three reels — tap one when they stop, or respin for a fresh draw.
      </p>

      <BetTeamsPanel />

      {categories ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {categories.map((cat, index) => {
            const idx = index as 0 | 1 | 2;
            return (
              <ReelTrack
                key={`${cat.id}-${spinKey}`}
                index={idx}
                category={cat}
                spinKey={spinKey}
                selected={selected === idx}
                onSelect={() => dispatch({ type: 'SELECT_CATEGORY', index: idx })}
              />
            );
          })}
        </div>
      ) : (
        <div
          className="grid grid-cols-3 gap-2 sm:gap-4"
          aria-busy="true"
          aria-label="Drawing categories"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[260px] animate-pulse rounded-xl border border-line bg-surface"
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleRespin}
        disabled={!categories}
        className="mt-5 w-full rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
      >
        ↻ Respin all
      </button>

      <div className="mt-6">
        <BetGoldButton
          disabled={selected === null}
          onClick={() => dispatch({ type: 'START_PLAY' })}
        >
          {selectedCategory
            ? `Play ${selectedCategory.text}`
            : 'Select a reel'}
        </BetGoldButton>
      </div>
    </BetPageWrap>
  );
}
