import { useState } from 'react';
import { useExposed } from '../context';
import type { Player } from '../types';
import { PLAYER_COUNT, createDefaultPlayers, HIDDEN_POINTS, REVEALED_POINTS } from '../utils';
import ExposedPanel, { ExposedPageWrap } from './ExposedPanel';
import PlayerAvatar from './PlayerAvatar';

export default function ExposedSetupScreen() {
  const { state, dispatch } = useExposed();
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
    <ExposedPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        New game
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        4 players, 8 rounds. Pass the phone around, answer out loud, then flip
        the coin and pray.
      </p>

      <ExposedPanel>
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
                  <label className="sr-only" htmlFor={`exp-player-${player.id}`}>
                    Player {index + 1} name
                  </label>
                  <input
                    id={`exp-player-${player.id}`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(player.id, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="min-h-9 min-w-0 flex-1 rounded-lg border border-line bg-deep px-2.5 font-body text-[15px] font-semibold text-text-hi outline-none placeholder:text-text-low focus-visible:border-toxic focus-visible:ring-1 focus-visible:ring-toxic"
                    maxLength={24}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-[26px] rounded-xl border border-line bg-surface px-3.5 py-3">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-toxic-bright">
            How it works
          </p>
          <p className="font-body text-[13px] leading-snug text-text-mid">
            Each round, one random player privately reads a brutal question and
            answers out loud by naming someone else in the room — without
            revealing the question. Then the coin decides your fate: stay
            hidden for <span className="font-semibold text-text-hi">{HIDDEN_POINTS} point</span>,
            or get exposed for <span className="font-semibold text-text-hi">{REVEALED_POINTS} points</span>.
          </p>
        </section>

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="mt-8 w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #C6E86B, #9BC53D 55%, #4A5A1A)' }}
        >
          Start game
        </button>
      </ExposedPanel>
    </ExposedPageWrap>
  );
}
