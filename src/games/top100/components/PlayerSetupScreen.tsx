import { useEffect, useState } from 'react';
import { getAllCategories } from '../../../data/categories';
import { useTop100 } from '../context';
import {
  addPlayer,
  removePlayer,
  updatePlayerName,
} from '../reducer';
import type { GameMode, Player } from '../types';
import { createDefaultPlayers } from '../utils';
import CategoryPicker from './CategoryPicker';
import PlayerAvatar from './PlayerAvatar';
import Top100Panel, { Top100PageWrap } from './Top100Panel';

const GAME_MODES: { id: GameMode; label: string; description: string }[] = [
  {
    id: 'full',
    label: 'Full game',
    description: 'Every player deals once, rotating from your chosen dealer.',
  },
  {
    id: 'single',
    label: 'Single round',
    description: 'One category with a fixed dealer — quick session.',
  },
];

export default function PlayerSetupScreen() {
  const { state, dispatch } = useTop100();
  const [players, setPlayers] = useState<Player[]>(() =>
    state.players.length >= 3 ? state.players : createDefaultPlayers(4),
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(
    () => players[0]?.id ?? null,
  );
  const [gameMode, setGameMode] = useState<GameMode>('full');

  useEffect(() => {
    if (state.phase === 'setup' && state.players.length >= 3) {
      setPlayers(state.players);
      setSelectedCategoryId(null);
      setSelectedDealerId(state.players[0]?.id ?? null);
      setGameMode('full');
    }
  }, [state.phase, state.players]);

  useEffect(() => {
    if (selectedDealerId && !players.some((p) => p.id === selectedDealerId)) {
      setSelectedDealerId(players[0]?.id ?? null);
    }
  }, [players, selectedDealerId]);

  const categories = getAllCategories();
  const selectedDealer = players.find((p) => p.id === selectedDealerId);
  const canStart =
    players.length >= 3 &&
    players.every((p) => p.name.trim().length > 0) &&
    selectedCategoryId !== null &&
    selectedDealerId !== null;

  function handleNameChange(id: string, name: string) {
    setPlayers((prev) => updatePlayerName(prev, id, name));
  }

  function handleAddPlayer() {
    setPlayers((prev) => addPlayer(prev));
  }

  function handleRemovePlayer(id: string) {
    setPlayers((prev) => {
      const next = removePlayer(prev, id);
      if (selectedDealerId === id) {
        setSelectedDealerId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  function handleStart() {
    if (!canStart || !selectedCategoryId || !selectedDealerId) return;
    dispatch({
      type: 'START_GAME',
      players,
      categoryId: selectedCategoryId,
      dealerId: selectedDealerId,
      gameMode,
    });
  }

  const categoryDescription =
    gameMode === 'single' && selectedDealer
      ? `${selectedDealer.name} deals for this round only.`
      : selectedDealer
        ? `${selectedDealer.name} deals first — each player picks a fresh category when it's their turn.`
        : undefined;

  return (
    <Top100PageWrap>
      <h1 className="mb-2 font-display text-[30px] font-extrabold tracking-[-0.5px] text-text-hi">
        New game
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        Add players, choose who deals, pick a category, and start.
      </p>

      <Top100Panel>
        <section className="mb-[26px]">
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Game mode</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {GAME_MODES.map((mode) => {
              const selected = gameMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setGameMode(mode.id)}
                  className={`rounded-xl border bg-surface p-4 text-left transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void ${
                    selected
                      ? 'border-steel-blue shadow-[0_0_0_1px_#6FA8DC_inset]'
                      : 'border-line hover:border-line-bright'
                  }`}
                  aria-pressed={selected}
                >
                  <p className="mb-1 font-body text-sm font-bold text-text-hi">{mode.label}</p>
                  <p className="font-body text-[12px] leading-snug text-text-mid">
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Players</p>
          <p className="mb-3 font-body text-[13px] text-text-mid">
            Tap a player to set them as dealer.
          </p>
          <ul className="flex flex-col gap-2.5">
            {players.map((player, index) => {
              const isDealer = selectedDealerId === player.id;
              return (
                <li key={player.id}>
                  <div
                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-[border-color,box-shadow] ${
                      isDealer
                        ? 'border-steel-blue bg-surface shadow-[0_0_0_1px_#6FA8DC_inset]'
                        : 'border-line bg-surface'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDealerId(player.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      aria-pressed={isDealer}
                      aria-label={`${player.name}${isDealer ? ', selected as dealer' : ''}`}
                    >
                      <PlayerAvatar name={player.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-body text-[15px] font-semibold text-text-hi">
                          {player.name}
                        </span>
                        {isDealer && (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-steel-blue">
                            Dealer
                          </span>
                        )}
                      </span>
                    </button>
                    <label className="sr-only" htmlFor={`player-name-${player.id}`}>
                      Player {index + 1} name
                    </label>
                    <input
                      id={`player-name-${player.id}`}
                      type="text"
                      value={player.name}
                      onChange={(e) => handleNameChange(player.id, e.target.value)}
                      className="min-h-9 w-[120px] shrink-0 rounded-lg border border-line bg-deep px-2.5 font-body text-[15px] font-semibold text-text-hi outline-none focus-visible:border-steel-blue focus-visible:ring-1 focus-visible:ring-steel-blue min-[641px]:w-[160px]"
                      maxLength={24}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(player.id)}
                      disabled={players.length <= 3}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-transparent text-text-low transition-colors hover:text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Remove ${player.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          type="button"
          onClick={handleAddPlayer}
          disabled={players.length >= 8}
          className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-bright px-3 py-3 font-mono text-[13px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add player
        </button>

        <div className="mt-[26px]">
          <CategoryPicker
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            heading={gameMode === 'single' ? 'Category' : 'First category'}
            description={categoryDescription}
          />
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="mt-6 w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 50%, #8B8F99)',
          }}
        >
          {gameMode === 'single' ? 'Start round' : 'Start game'}
        </button>
      </Top100Panel>
    </Top100PageWrap>
  );
}
