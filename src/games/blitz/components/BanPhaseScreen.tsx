import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useBlitz } from '../context';
import { BLITZ_CATEGORIES } from '../../../data/blitz-questions';
import { BANS_PER_PLAYER, capitalize } from '../utils';
import BlitzPanel, { BlitzPageWrap } from './BlitzPanel';
import PlayerAvatar from './PlayerAvatar';

export default function BanPhaseScreen() {
  const { state, dispatch } = useBlitz();
  const [query, setQuery] = useState('');

  const picker = state.players[state.banPickerIndex];
  /** Bans locked in by earlier players this phase. */
  const lockedCount = state.banPickerIndex * BANS_PER_PLAYER;
  const myBans = state.bannedCategoryIds.slice(lockedCount);
  const canConfirm = myBans.length === BANS_PER_PLAYER;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? BLITZ_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q))
      : BLITZ_CATEGORIES;
    return list;
  }, [query]);

  if (!picker) return null;

  return (
    <BlitzPageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
        Ban phase &middot; player {state.banPickerIndex + 1} of {state.players.length}
      </p>

      <div className="mb-4 flex items-center justify-center gap-2">
        {state.players.map((_, i) => (
          <span
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === state.banPickerIndex ? '22px' : '9px',
              background:
                i < state.banPickerIndex
                  ? 'rgba(201,205,214,0.5)'
                  : i === state.banPickerIndex
                    ? '#C9CDD6'
                    : 'rgba(220,224,232,0.2)',
            }}
          />
        ))}
      </div>

      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <PlayerAvatar name={picker.name} size="lg" />
        <h1 className="font-display text-2xl font-extrabold text-text-hi">{picker.name}</h1>
        <p className="max-w-[300px] font-body text-[13px] text-text-mid">
          Pick <span className="font-bold text-text-hi">{BANS_PER_PLAYER}</span> categories you want
          removed from this whole game. Nobody will get asked about them.
        </p>
      </div>

      <BlitzPanel className="mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories…"
          className="mb-3 w-full rounded-xl border border-line bg-void px-3.5 py-2.5 font-body text-sm text-text-hi placeholder:text-text-low focus:border-silver focus:outline-none"
        />

        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-low">
            {myBans.length} / {BANS_PER_PLAYER} chosen
          </span>
          <span className="font-mono text-[10px] text-text-low">
            {query ? `${filtered.length} shown` : `${BLITZ_CATEGORIES.length} total`}
          </span>
        </div>

        <div className="max-h-[320px] overflow-y-auto pr-1">
          <ul className="flex flex-col gap-1.5">
            {filtered.map((cat) => {
              const bannedByMe = myBans.includes(cat.id);
              const bannedEarlier =
                state.bannedCategoryIds.includes(cat.id) && !bannedByMe;
              const atLimit = myBans.length >= BANS_PER_PLAYER && !bannedByMe;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    disabled={bannedEarlier || atLimit}
                    onClick={() => dispatch({ type: 'TOGGLE_BAN', categoryId: cat.id })}
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                      bannedByMe
                        ? 'border-bad text-bad'
                        : 'border-line text-text-mid hover:border-line-bright'
                    }`}
                    style={bannedByMe ? { background: 'rgba(224,139,122,0.12)' } : undefined}
                  >
                    <span className="font-mono text-[11px]">{bannedByMe ? '✕' : bannedEarlier ? '—' : '+'}</span>
                    <span className="min-w-0 flex-1 truncate font-body text-[13px]">
                      {capitalize(cat.label)}
                    </span>
                    {bannedEarlier && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-text-low">
                        already banned
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {filtered.length === 0 && (
            <p className="py-6 text-center font-body text-[13px] text-text-low">
              Nothing matches &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </BlitzPanel>

      {myBans.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {myBans.map((id) => {
            const cat = BLITZ_CATEGORIES.find((c) => c.id === id);
            return (
              <motion.span
                key={id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full border border-bad/50 bg-bad/10 px-3 py-1 font-mono text-[11px] text-bad"
              >
                {cat ? capitalize(cat.label) : id}
              </motion.span>
            );
          })}
        </div>
      )}

      <button
        type="button"
        disabled={!canConfirm}
        onClick={() => {
          dispatch({ type: 'CONFIRM_BANS' });
          setQuery('');
        }}
        className="w-full rounded-xl border-none px-4 py-3.5 font-display text-base font-extrabold text-void transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 55%, #8B8F99)' }}
      >
        {state.banPickerIndex + 1 < state.players.length
          ? 'Lock in — pass to next player'
          : 'Lock in — start the game'}
      </button>
    </BlitzPageWrap>
  );
}
