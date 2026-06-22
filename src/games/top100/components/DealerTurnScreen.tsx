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
import { Top100PageWrap } from './Top100Panel';

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

  return (
    <Top100PageWrap>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[19px] font-bold text-text-hi">
            {category.title}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase text-text-low">
            Rank 1 = least points · Rank 100 = most points
          </p>
        </div>

        <div className="flex items-center">
          <div className="flex gap-1.5" aria-label={`Round ${state.round} of 3`}>
            {[1, 2, 3].map((roundNum) => (
              <span
                key={roundNum}
                className={`h-1.5 w-[26px] rounded-[3px] ${
                  roundNum < state.round ? 'bg-steel-blue' : 'bg-line-bright'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 font-mono text-[11px] uppercase text-text-mid">
            Round {state.round} of 3
          </span>
        </div>
      </header>

      <ScoreboardStrip state={state} />

      <div
        className="mb-5 rounded-[14px] border border-line px-[18px] py-[18px] text-center"
        style={{
          background: 'linear-gradient(165deg, #222428, #1A1C20)',
        }}
      >
        <p className="font-display text-lg font-bold text-text-hi">
          {guesserName ? `${guesserName}'s guess` : '—'}
        </p>
        <p className="mt-1 font-body text-[13px] text-text-mid">
          {dealer.name} is dealing — find {guesserName || 'the player'}&apos;s answer on
          the list, or mark it not found.
        </p>
      </div>

      <label className="mb-3.5 block">
        <span className="sr-only">Search ranked list</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search the list… e.g. "Attack on"'
          className="w-full rounded-xl border border-line bg-surface px-4 py-[13px] font-body text-sm text-text-hi placeholder:text-text-low focus-visible:border-line-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
        />
      </label>

      <ul
        className="max-h-[340px] overflow-y-auto rounded-[14px] border border-line bg-surface"
        aria-label="Ranked items"
      >
        {filteredItems.length === 0 ? (
          <li className="px-4 py-8 text-center font-body text-sm text-text-mid">
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
                    className="flex cursor-default items-center gap-3.5 px-4 py-[11px] opacity-45"
                    aria-label={`${item.name}, rank ${item.rank}, claimed by ${claimer?.name}`}
                  >
                    <span className="w-7 shrink-0 text-right font-mono text-xs text-text-low">
                      {item.rank}
                    </span>
                    <span className="flex-1 truncate font-body text-sm text-text-hi">
                      {item.name}
                      {claimLabel && (
                        <span className="ml-2.5 inline-block rounded-[5px] border border-good px-1.5 py-px font-mono text-[10px] text-good">
                          {claimLabel}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-text-low">
                      {item.rank} pts
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={Boolean(state.reveal) || !guesserId}
                    onClick={() => dispatch({ type: 'RESOLVE_CORRECT', rank: item.rank })}
                    className="flex w-full items-center gap-3.5 px-4 py-[11px] text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel-blue disabled:cursor-not-allowed"
                  >
                    <span className="w-7 shrink-0 text-right font-mono text-xs text-text-low">
                      {item.rank}
                    </span>
                    <span className="flex-1 truncate font-body text-sm text-text-hi">
                      {item.name}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-text-low">
                      {item.rank} pts
                    </span>
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>

      <div className="mt-4 flex flex-col gap-3 min-[481px]:flex-row min-[481px]:items-center">
        <button
          type="button"
          disabled={Boolean(state.reveal) || !guesserId}
          onClick={() => dispatch({ type: 'RESOLVE_WRONG' })}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-bad bg-transparent px-4 font-body text-sm font-bold text-bad transition-colors hover:bg-bad/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✕ Not on the list
        </button>
        <span className="hidden font-mono text-[11px] text-text-low min-[481px]:inline">
          Tap an item above once {guesserName || 'the player'} names it
        </span>
      </div>

      {state.reveal && (
        <RevealToast
          reveal={state.reveal}
          state={state}
          onDismiss={handleDismissReveal}
        />
      )}
    </Top100PageWrap>
  );
}
