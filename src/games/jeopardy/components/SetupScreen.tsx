import { useEffect, useState } from 'react';
import { useJeopardy } from '../context';
import type { Player } from '../types';
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  SILVER_BUTTON,
  createDefaultPlayers,
  freshLifelines,
} from '../utils';
import JeopardyPanel, { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';

export default function SetupScreen() {
  const { state, dispatch } = useJeopardy();
  const [players, setPlayers] = useState<Player[]>(() => {
    if (state.pendingPlayers.length >= MIN_PLAYERS) return state.pendingPlayers;
    if (state.players.length >= MIN_PLAYERS) return state.players;
    return createDefaultPlayers(4);
  });

  useEffect(() => {
    if (state.phase === 'setup' && state.pendingPlayers.length >= MIN_PLAYERS) {
      setPlayers(state.pendingPlayers);
    }
  }, [state.phase, state.pendingPlayers]);

  const canStart =
    players.length >= MIN_PLAYERS && players.every((p) => p.name.trim().length > 0);

  function handleNameChange(id: string, name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function handleAddPlayer() {
    setPlayers((prev) => {
      if (prev.length >= MAX_PLAYERS) return prev;
      const usedNums = prev
        .map((p) => Number(p.id.replace('player-', '')))
        .filter((n) => !Number.isNaN(n));
      const nextNum = (usedNums.length ? Math.max(...usedNums) : 0) + 1;
      return [
        ...prev,
        {
          id: `player-${nextNum}`,
          name: `Player ${nextNum}`,
          score: 0,
          correct: 0,
          missed: 0,
          doublesHit: 0,
          lifelines: freshLifelines(),
        },
      ];
    });
  }

  function handleRemovePlayer(id: string) {
    setPlayers((prev) =>
      prev.length <= MIN_PLAYERS ? prev : prev.filter((p) => p.id !== id),
    );
  }

  function handleReady() {
    if (!canStart) return;
    dispatch({ type: 'PLAYERS_READY', players });
  }

  return (
    <JeopardyPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        New game
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        Set up your players, then preview tonight&apos;s six categories before the
        board is built.
      </p>

      <JeopardyPanel>
        <section>
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Players</p>
          <p className="mb-3 font-body text-[13px] text-text-mid">
            At least {MIN_PLAYERS} players take turns picking tiles.
          </p>
          <ul className="flex flex-col gap-2.5">
            {players.map((player, index) => (
              <li key={player.id}>
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
                  <PlayerAvatar name={player.name} />
                  <label className="sr-only" htmlFor={`jeo-player-${player.id}`}>
                    Player {index + 1} name
                  </label>
                  <input
                    id={`jeo-player-${player.id}`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(player.id, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="min-h-9 min-w-0 flex-1 rounded-lg border border-line bg-deep px-2.5 font-body text-[15px] font-semibold text-text-hi outline-none placeholder:text-text-low focus-visible:border-steel-blue focus-visible:ring-1 focus-visible:ring-steel-blue"
                    maxLength={24}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    disabled={players.length <= MIN_PLAYERS}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-transparent text-text-low transition-colors hover:text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Remove ${player.name}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleAddPlayer}
            disabled={players.length >= MAX_PLAYERS}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-bright px-3 py-3 font-mono text-[13px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add player
          </button>
        </section>

        <p className="mt-5 font-mono text-[11px] leading-relaxed text-text-low">
          Step 1 of 3 · players · then topic preview · then the board
        </p>

        <button
          type="button"
          onClick={handleReady}
          disabled={!canStart}
          className="mt-6 w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: SILVER_BUTTON }}
        >
          Ready — pick topics
        </button>
      </JeopardyPanel>
    </JeopardyPageWrap>
  );
}
