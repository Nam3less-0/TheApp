import { useState } from 'react';
import { useBlitz } from '../context';
import type { Player } from '../types';
import { PLAYER_COUNT, TARGET_SCORE, createDefaultPlayers } from '../utils';
import BlitzPanel, { BlitzPageWrap } from './BlitzPanel';
import PlayerAvatar from './PlayerAvatar';

export default function BlitzSetupScreen() {
  const { state, dispatch } = useBlitz();
  const [players, setPlayers] = useState<Player[]>(() =>
    state.players.length === PLAYER_COUNT ? state.players : createDefaultPlayers(),
  );

  const canStart = players.every((p) => p.name.trim().length > 0);

  function handleNameChange(id: string, name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function handleStart() {
    if (!canStart) return;
    dispatch({ type: 'START_GAME', players });
  }

  return (
    <BlitzPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        New game
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        A random player gets a category and a clock. Name enough in time and
        hit NEXT. Miss it, and everyone else scores. You can pause the clock
        to argue about a category, and everyone gets 2 rerolls a game if they
        get stuck with one they don&rsquo;t know.
      </p>

      <BlitzPanel>
        <section>
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Players</p>
          <p className="mb-3 font-body text-[13px] text-text-mid">
            Exactly {PLAYER_COUNT} — name everyone before you start.
          </p>
          <ul className="flex flex-col gap-2.5">
            {players.map((player, index) => (
              <li key={player.id}>
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
                  <PlayerAvatar name={player.name} />
                  <label className="sr-only" htmlFor={`blz-player-${player.id}`}>
                    Player {index + 1} name
                  </label>
                  <input
                    id={`blz-player-${player.id}`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(player.id, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="min-h-9 min-w-0 flex-1 rounded-lg border border-line bg-deep px-2.5 font-body text-[15px] font-semibold text-text-hi outline-none placeholder:text-text-low focus-visible:border-silver focus-visible:ring-1 focus-visible:ring-silver"
                    maxLength={24}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-[26px] rounded-xl border border-line bg-surface px-3.5 py-3">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-silver-bright">
            How it works
          </p>
          <p className="font-body text-[13px] leading-snug text-text-mid">
            Each round a random player gets a category (like{' '}
            <span className="font-semibold text-text-hi">
              &ldquo;Name 3 tea leaves in 10 seconds&rdquo;
            </span>
            ) and answers out loud. Hit{' '}
            <span className="font-semibold text-text-hi">NEXT</span> before
            the timer runs out to pass safely. Run out of time, and every
            other player gets{' '}
            <span className="font-semibold text-text-hi">+1 point</span>.
            First to{' '}
            <span className="font-semibold text-text-hi">{TARGET_SCORE} points</span>{' '}
            wins.
          </p>
        </section>

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="mt-8 w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 55%, #8B8F99)' }}
        >
          Start game
        </button>
      </BlitzPanel>
    </BlitzPageWrap>
  );
}
