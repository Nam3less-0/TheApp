import { useState } from 'react';
import { useImposter } from '../context';
import type { Player } from '../types';
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  ROUND_OPTIONS,
  createDefaultPlayers,
} from '../utils';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';
import PlayerAvatar from './PlayerAvatar';

export default function ImposterSetupScreen() {
  const { state, dispatch } = useImposter();
  const [players, setPlayers] = useState<Player[]>(() =>
    state.players.length >= MIN_PLAYERS ? state.players : createDefaultPlayers(4),
  );
  const [totalRounds, setTotalRounds] = useState<number>(state.totalRounds ?? 5);

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
        { id: `player-${nextNum}`, name: `Player ${nextNum}`, score: 0 },
      ];
    });
  }

  function handleRemovePlayer(id: string) {
    setPlayers((prev) =>
      prev.length <= MIN_PLAYERS ? prev : prev.filter((p) => p.id !== id),
    );
  }

  function handleStart() {
    if (!canStart) return;
    dispatch({ type: 'START_GAME', players, totalRounds });
  }

  return (
    <ImposterPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        New game
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        Add players, pick how many rounds, then pass the phone around to spot the
        imposter.
      </p>

      <ImposterPanel>
        <section>
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Players</p>
          <p className="mb-3 font-body text-[13px] text-text-mid">
            At least {MIN_PLAYERS} players — one will secretly be the imposter.
          </p>
          <ul className="flex flex-col gap-2.5">
            {players.map((player, index) => (
              <li key={player.id}>
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
                  <PlayerAvatar name={player.name} />
                  <label className="sr-only" htmlFor={`imp-player-${player.id}`}>
                    Player {index + 1} name
                  </label>
                  <input
                    id={`imp-player-${player.id}`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(player.id, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="min-h-9 min-w-0 flex-1 rounded-lg border border-line bg-deep px-2.5 font-body text-[15px] font-semibold text-text-hi outline-none placeholder:text-text-low focus-visible:border-ember focus-visible:ring-1 focus-visible:ring-ember"
                    maxLength={24}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    disabled={players.length <= MIN_PLAYERS}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-transparent text-text-low transition-colors hover:text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-30"
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
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-bright px-3 py-3 font-mono text-[13px] text-text-mid transition-colors hover:border-ember/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add player
          </button>
        </section>

        <section className="mt-[26px]">
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Rounds</p>
          <p className="mb-3 font-body text-[13px] text-text-mid">
            How many rounds before the final standings.
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {ROUND_OPTIONS.map((count) => {
              const selected = totalRounds === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setTotalRounds(count)}
                  aria-pressed={selected}
                  className={`flex min-h-12 items-center justify-center rounded-xl border font-display text-lg font-bold transition-[border-color,box-shadow,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                    selected
                      ? 'border-ember text-ember-bright shadow-[0_0_0_1px_#C2533B_inset]'
                      : 'border-line bg-surface text-text-mid hover:border-line-bright hover:text-text-hi'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-[26px] rounded-xl border border-line bg-surface px-3.5 py-3">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ember-bright">
            Blank rounds
          </p>
          <p className="font-body text-[13px] leading-snug text-text-mid">
            Each round randomly picks one of two modes: the imposter gets a
            different word from the bucket, or gets no word at all. Roughly half
            of rounds are blank — everyone else shares one word and the imposter is
            only told they&rsquo;re the imposter. Evade the vote for{' '}
            <span className="font-semibold text-text-hi">3 points</span> — or, if
            caught, guess the word for <span className="font-semibold text-text-hi">1 point</span>{' '}
            while everyone else gets nothing.
          </p>
        </section>

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="mt-8 w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
        >
          Start game
        </button>
      </ImposterPanel>
    </ImposterPageWrap>
  );
}
