import { useCallback, useMemo, useState } from 'react';
import { useTop100 } from '../context';
import {
  getCurrentGuesserId,
  getDealer,
  getGuesserName,
  getInitials,
} from '../utils';
import RevealToast from './RevealToast';
import ScoreboardStrip from './ScoreboardStrip';
import Top100Panel, { Top100PageWrap } from './Top100Panel';

export default function DealerTurnScreen() {
  const { state, dispatch } = useTop100();
  const [search, setSearch] = useState('');

  const category = state.currentCategory;
  const dealer = getDealer(state);
  const guesserId = getCurrentGuesserId(state);
  const guesserName = getGuesserName(state);

  const filteredItems = useMemo(() => {
    if (!category) return [];
    const query = search.trim().toLowerCase();
    const sorted = [...category.items].sort((a, b) => a.rank - b.rank);
    if (!query) return sorted;
    return sorted.filter((item) => item.name.toLowerCase().includes(query));
  }, [category, search]);

  const handleDismissReveal = useCallback(() => {
    dispatch({ type: 'DISMISS_REVEAL' });
  }, [dispatch]);

  if (!category || !dealer) return null;

  const claimedByPlayer = (rank: number) =>
    state.claimedThisTurn.find((c) => c.rank === rank);

  const actionsDisabled = Boolean(state.reveal) || !guesserId;

  return (
    <Top100PageWrap variant="game">
      <header className="shrink-0 border-b border-line py-3.5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Round {state.round} of 3
            </p>
            <h1 className="mt-0.5 truncate font-display text-lg font-bold text-text-hi sm:text-[21px]">
              {category.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((roundNum) => (
              <span
                key={roundNum}
                className={`h-2 w-8 rounded-full transition-colors ${
                  roundNum <= state.round ? 'bg-steel-blue' : 'bg-line'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="mt-3 lg:hidden">
          <ScoreboardStrip state={state} layout="strip" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 py-4 lg:flex-row lg:gap-5 lg:py-5">
        <aside className="flex shrink-0 flex-col gap-4 lg:w-[280px] xl:w-[300px]">
          <Top100Panel compact className="hidden lg:block">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Players
            </p>
            <ScoreboardStrip state={state} layout="sidebar" />
          </Top100Panel>

          <Top100Panel compact>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-blue">
              Now guessing
            </p>
            <p className="mt-1 font-display text-xl font-bold text-text-hi">
              {guesserName || '—'}
            </p>
            <p className="mt-2 font-body text-[13px] leading-snug text-text-mid">
              {dealer.name} is dealing — tap a match on the list, or mark it not found.
            </p>
            <p className="mt-3 hidden font-mono text-[11px] text-text-low lg:block">
              Rank 1 = fewest pts · Rank 100 = most pts
            </p>
          </Top100Panel>

          <button
            type="button"
            disabled={actionsDisabled}
            onClick={() => dispatch({ type: 'RESOLVE_WRONG' })}
            className="hidden min-h-[48px] items-center justify-center gap-2 rounded-xl border border-bad bg-transparent px-4 font-body text-sm font-bold text-bad transition-colors hover:bg-bad/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
          >
            ✕ Not on the list
          </button>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <label className="mb-3 block shrink-0">
            <span className="sr-only">Search ranked list</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search the list… e.g. "Attack on"'
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-text-hi placeholder:text-text-low focus-visible:border-line-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
            />
          </label>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-surface">
            <div className="grid shrink-0 grid-cols-[2.5rem_1fr_4.5rem] gap-3 border-b border-line bg-deep/50 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
              <span>#</span>
              <span>Item</span>
              <span className="text-right">Pts</span>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto" aria-label="Ranked items">
              {filteredItems.length === 0 ? (
                <li className="px-4 py-10 text-center font-body text-sm text-text-mid">
                  No matches found.
                </li>
              ) : (
                filteredItems.map((item) => {
                  const claim = claimedByPlayer(item.rank);
                  const claimed = Boolean(claim);
                  const claimer = claim
                    ? state.players.find((p) => p.id === claim.claimedBy)
                    : null;
                  const claimLabel = claimer
                    ? `${getInitials(claimer.name)} · R${item.rank}`
                    : '';

                  return (
                    <li key={item.rank} className="border-b border-line last:border-b-0">
                      {claimed ? (
                        <div
                          className="grid cursor-default grid-cols-[2.5rem_1fr_4.5rem] items-center gap-3 px-4 py-2.5 opacity-45"
                          aria-label={`${item.name}, rank ${item.rank}, claimed by ${claimer?.name}`}
                        >
                          <span className="text-right font-mono text-xs text-text-low">
                            {item.rank}
                          </span>
                          <span className="min-w-0 truncate font-body text-sm text-text-hi">
                            {item.name}
                            {claimLabel && (
                              <span className="ml-2 inline-block rounded-[5px] border border-good px-1.5 py-px font-mono text-[10px] text-good">
                                {claimLabel}
                              </span>
                            )}
                          </span>
                          <span className="text-right font-mono text-[11px] text-text-low">
                            {item.rank}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={actionsDisabled}
                          onClick={() => dispatch({ type: 'RESOLVE_CORRECT', rank: item.rank })}
                          className="grid w-full grid-cols-[2.5rem_1fr_4.5rem] items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel-blue disabled:cursor-not-allowed"
                        >
                          <span className="text-right font-mono text-xs text-text-low">
                            {item.rank}
                          </span>
                          <span className="min-w-0 truncate font-body text-sm text-text-hi">
                            {item.name}
                          </span>
                          <span className="text-right font-mono text-[11px] text-text-low">
                            {item.rank}
                          </span>
                        </button>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <p className="mt-2 shrink-0 text-center font-mono text-[11px] text-text-low lg:text-left">
            {filteredItems.length} items shown
            {search.trim() ? ` · filtered` : ''}
          </p>
        </main>
      </div>

      <div className="shrink-0 border-t border-line bg-void/80 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          disabled={actionsDisabled}
          onClick={() => dispatch({ type: 'RESOLVE_WRONG' })}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-bad bg-transparent px-4 font-body text-sm font-bold text-bad transition-colors hover:bg-bad/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✕ Not on the list
        </button>
      </div>

      {state.reveal && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 px-4 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-md lg:px-0">
          <RevealToast
            reveal={state.reveal}
            state={state}
            onDismiss={handleDismissReveal}
          />
        </div>
      )}
    </Top100PageWrap>
  );
}
