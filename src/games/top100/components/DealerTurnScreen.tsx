import { useCallback, useMemo, useState } from 'react';
import { useTop100 } from '../context';
import { getRankTier, RANK_TIER_STYLES } from '../theme';
import {
  getCurrentGuesserId,
  getDealer,
  getGuesserName,
  getInitials,
} from '../utils';
import RevealToast from './RevealToast';
import ScoreboardStrip from './ScoreboardStrip';
import { DealerIcon, GuesserIcon, SearchIcon } from './Top100Icons';
import Top100Panel, { RankBadge, Top100PageWrap } from './Top100Panel';
import PlayerAvatar from './PlayerAvatar';

function GuesserPanel({
  guesserName,
  dealerName,
  compact = false,
}: {
  guesserName: string;
  dealerName: string;
  compact?: boolean;
}) {
  return (
    <Top100Panel compact glow className={compact ? 'py-3 sm:py-4' : undefined}>
      <div className={`flex items-start gap-3 ${compact ? 'sm:items-center' : ''}`}>
        {guesserName ? (
          <PlayerAvatar name={guesserName} size={compact ? 'md' : 'lg'} ring />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-text-low sm:h-12 sm:w-12">
            <GuesserIcon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-blue">
            <GuesserIcon className="h-3 w-3" />
            Now guessing
          </p>
          <p className="mt-0.5 truncate font-display text-lg font-extrabold text-text-hi sm:text-xl">
            {guesserName || '—'}
          </p>
          {!compact && (
            <p className="mt-2 font-body text-[13px] leading-relaxed text-text-mid">
              <span className="inline-flex items-center gap-1 font-semibold text-pewter">
                <DealerIcon className="h-3.5 w-3.5" />
                {dealerName}
              </span>{' '}
              is dealing — tap a match on the list, or mark it not found.
            </p>
          )}
        </div>
        {compact && (
          <p className="hidden shrink-0 font-body text-[12px] text-text-mid sm:block">
            <span className="font-semibold text-pewter">{dealerName}</span> dealing
          </p>
        )}
      </div>
      {!compact && (
        <div className="mt-3 rounded-lg border border-line/60 bg-deep/40 px-3 py-2 2xl:hidden">
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">Scoring</p>
          <p className="mt-0.5 font-body text-[12px] text-text-mid">
            Rank 1 = fewest pts · Rank 100 = most pts
          </p>
        </div>
      )}
    </Top100Panel>
  );
}

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

  const listGridCols =
    'grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] sm:grid-cols-[3rem_minmax(0,1fr)_3.5rem] md:grid-cols-[3.5rem_minmax(0,1fr)_4rem]';

  return (
    <Top100PageWrap variant="game">
      <header className="shrink-0 border-b border-line/80 py-3.5 md:py-4">
        <div className="flex flex-wrap items-start justify-between gap-3 gap-y-2">
          <div className="min-w-0 flex-1 basis-[min(100%,280px)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-blue">
              Round {state.round} of 3
            </p>
            <h1 className="mt-0.5 font-display text-lg font-extrabold tracking-[-0.02em] text-text-hi sm:text-xl md:text-[22px] lg:text-2xl">
              {category.title}
            </h1>
          </div>

          <div className="flex items-center gap-1.5" aria-label={`Round ${state.round} of 3`}>
            {[1, 2, 3].map((roundNum) => (
              <span
                key={roundNum}
                className={`h-2 rounded-full transition-all duration-300 ${
                  roundNum <= state.round
                    ? 'w-8 bg-steel-blue shadow-[0_0_8px_rgba(111,168,220,0.5)] sm:w-10'
                    : 'w-5 bg-line sm:w-6'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Below xl: horizontal scoreboard under title */}
        <div className="mt-3 xl:hidden">
          <ScoreboardStrip state={state} layout="strip" />
        </div>
      </header>

      {/* md–lg: compact guesser bar above the list */}
      <div className="mt-4 shrink-0 md:block xl:hidden">
        <GuesserPanel guesserName={guesserName} dealerName={dealer.name} compact />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 py-4 md:gap-5 md:py-5 xl:grid-cols-[minmax(240px,22vw)_minmax(0,1fr)] 2xl:grid-cols-[minmax(260px,18vw)_minmax(0,1fr)_auto] xl:gap-6">
        {/* Sidebar: scoreboard + guesser (xl only) + wrong button */}
        <aside className="hidden min-w-0 flex-col gap-4 xl:flex">
          <Top100Panel compact glow>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Scoreboard
            </p>
            <ScoreboardStrip state={state} layout="sidebar" />
          </Top100Panel>

          <GuesserPanel guesserName={guesserName} dealerName={dealer.name} />

          <button
            type="button"
            disabled={actionsDisabled}
            onClick={() => dispatch({ type: 'RESOLVE_WRONG' })}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-bad/60 bg-bad/5 px-4 font-body text-sm font-bold text-bad transition-all hover:border-bad hover:bg-bad/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 2xl:hidden"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-bad/15 text-xs">✕</span>
            Not on the list
          </button>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col">
          <label className="relative mb-3 block shrink-0">
            <span className="sr-only">Search ranked list</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-low" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search the list… e.g. "Attack on"'
              className="w-full rounded-xl border border-line bg-surface/80 py-3 pl-10 pr-4 font-body text-sm text-text-hi placeholder:text-text-low backdrop-blur-sm transition-colors focus-visible:border-steel-blue/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue/30"
            />
          </label>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-line/80 bg-surface/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div
              className={`grid shrink-0 ${listGridCols} gap-2 border-b border-line/80 bg-deep/60 px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider text-text-low sm:gap-3 sm:px-4`}
            >
              <span>Rank</span>
              <span>Item</span>
              <span className="text-right">Pts</span>
            </div>

            <ul className="top100-scroll min-h-0 flex-1 overflow-y-auto" aria-label="Ranked items">
              {filteredItems.length === 0 ? (
                <li className="flex flex-col items-center justify-center px-4 py-16 text-center">
                  <SearchIcon className="mb-3 h-8 w-8 text-text-low/40" />
                  <p className="font-body text-sm text-text-mid">No matches found.</p>
                  <p className="mt-1 font-mono text-[11px] text-text-low">Try a different search term</p>
                </li>
              ) : (
                filteredItems.map((item) => {
                  const claim = claimedByPlayer(item.rank);
                  const claimed = Boolean(claim);
                  const claimer = claim
                    ? state.players.find((p) => p.id === claim.claimedBy)
                    : null;
                  const tier = getRankTier(item.rank);
                  const tierStyle = RANK_TIER_STYLES[tier];

                  return (
                    <li key={item.rank} className="border-b border-line/50 last:border-b-0">
                      {claimed ? (
                        <div
                          className={`grid cursor-default ${listGridCols} items-center gap-2 px-3 py-2 opacity-40 sm:gap-3 sm:px-4 sm:py-2.5`}
                          aria-label={`${item.name}, rank ${item.rank}, claimed by ${claimer?.name}`}
                        >
                          <RankBadge rank={item.rank} size="sm" />
                          <span className="min-w-0 truncate font-body text-sm text-text-hi">
                            {item.name}
                            {claimer && (
                              <span className="ml-2 inline-flex items-center gap-1 rounded-md border border-good/40 bg-good/10 px-1.5 py-px font-mono text-[10px] text-good">
                                {getInitials(claimer.name)}
                              </span>
                            )}
                          </span>
                          <span className={`text-right font-mono text-[11px] tabular-nums ${tierStyle.text}`}>
                            {item.rank}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={actionsDisabled}
                          onClick={() => dispatch({ type: 'RESOLVE_CORRECT', rank: item.rank })}
                          className={`group grid w-full ${listGridCols} items-center gap-2 px-3 py-2 text-left transition-all hover:bg-steel-blue/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel-blue disabled:cursor-not-allowed sm:gap-3 sm:px-4 sm:py-2.5 ${
                            tier === 'elite' ? 'hover:bg-gold/[0.04]' : ''
                          }`}
                        >
                          <RankBadge
                            rank={item.rank}
                            size="sm"
                            className={tier === 'elite' ? RANK_TIER_STYLES.elite.glow : ''}
                          />
                          <span className="min-w-0 truncate font-body text-sm text-text-hi transition-colors group-hover:text-silver-bright">
                            {item.name}
                          </span>
                          <span className={`text-right font-mono text-[11px] tabular-nums ${tierStyle.text}`}>
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

          <p className="mt-2 shrink-0 text-center font-mono text-[11px] text-text-low md:text-left">
            {filteredItems.length} items shown
            {search.trim() ? ' · filtered' : ''}
          </p>
        </main>

        {/* 2xl: action column on the right */}
        <aside className="hidden min-w-[200px] max-w-[240px] flex-col gap-4 2xl:flex">
          <Top100Panel compact glow>
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">Scoring</p>
            <p className="mt-1 font-body text-[13px] leading-relaxed text-text-mid">
              Rank 1 = fewest pts · Rank 100 = most pts
            </p>
          </Top100Panel>
          <button
            type="button"
            disabled={actionsDisabled}
            onClick={() => dispatch({ type: 'RESOLVE_WRONG' })}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border border-bad/60 bg-bad/5 px-4 font-body text-sm font-bold text-bad transition-all hover:border-bad hover:bg-bad/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-bad/15 text-xs">✕</span>
            Not on the list
          </button>
        </aside>
      </div>

      <div className="shrink-0 border-t border-line/80 bg-void/80 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md xl:hidden">
        <button
          type="button"
          disabled={actionsDisabled}
          onClick={() => dispatch({ type: 'RESOLVE_WRONG' })}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-bad/60 bg-bad/5 px-4 font-body text-sm font-bold text-bad transition-all hover:bg-bad/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-bad/15 text-xs">✕</span>
          Not on the list
        </button>
      </div>

      {state.reveal && (
        <div className="pointer-events-none fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md md:right-8 lg:right-10 xl:right-12">
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
