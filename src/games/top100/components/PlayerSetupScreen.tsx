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
import { DealerIcon } from './Top100Icons';
import PlayerAvatar from './PlayerAvatar';
import Top100Panel, {
  Top100Frame,
  Top100PageWrap,
  Top100PrimaryButton,
  Top100SectionHeading,
} from './Top100Panel';

const GAME_MODES: { id: GameMode; label: string; description: string; icon: string }[] = [
  {
    id: 'full',
    label: 'Full game',
    description: 'Every player deals once, rotating from your chosen dealer.',
    icon: '↻',
  },
  {
    id: 'single',
    label: 'Single round',
    description: 'One category with a fixed dealer — quick session.',
    icon: '⚡',
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
      <header className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel-blue">
          Party trivia · Pass & play
        </p>
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-text-hi sm:text-[34px]">
          Set up your table
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-text-mid">
          Name your players, pick who deals first, then choose a ranked list to guess from.
          One phone runs the game — everyone plays together.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Top100Panel compact glow>
            <Top100SectionHeading title="Game mode" step={1} className="mb-4" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GAME_MODES.map((mode) => {
                const selected = gameMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setGameMode(mode.id)}
                    className={`relative overflow-hidden rounded-xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void sm:p-4 ${
                      selected
                        ? 'border-steel-blue/60 bg-steel-blue/10 shadow-[0_0_20px_-6px_rgba(111,168,220,0.35),inset_0_0_0_1px_rgba(111,168,220,0.25)]'
                        : 'border-line bg-surface/40 hover:border-line-bright hover:bg-surface/60'
                    }`}
                    aria-pressed={selected}
                  >
                    <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/80 text-base">
                      {mode.icon}
                    </span>
                    <p className="mb-1 font-body text-sm font-bold text-text-hi">{mode.label}</p>
                    <p className="font-body text-[12px] leading-snug text-text-mid">
                      {mode.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </Top100Panel>

          <Top100Panel compact glow>
            <Top100SectionHeading
              title="Players"
              description="Tap a player to set them as dealer."
              step={2}
              className="mb-4"
            />
            <ul className="flex flex-col gap-2.5">
              {players.map((player, index) => {
                const isDealer = selectedDealerId === player.id;
                return (
                  <li key={player.id}>
                    <div
                      className={`flex flex-col gap-2.5 rounded-xl border px-3 py-2.5 transition-all sm:flex-row sm:items-center sm:gap-3 sm:px-3.5 sm:py-3 ${
                        isDealer
                          ? 'border-steel-blue/60 bg-steel-blue/8 shadow-[inset_0_0_0_1px_rgba(111,168,220,0.2)]'
                          : 'border-line/80 bg-surface/40'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDealerId(player.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        aria-pressed={isDealer}
                        aria-label={`${player.name}${isDealer ? ', selected as dealer' : ''}`}
                      >
                        <PlayerAvatar name={player.name} size="md" ring={isDealer} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-body text-[15px] font-semibold text-text-hi">
                            {player.name}
                          </span>
                          {isDealer && (
                            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-steel-blue">
                              <DealerIcon className="h-3 w-3" />
                              Dealer
                            </span>
                          )}
                        </span>
                      </button>
                      <div className="flex items-center gap-2 sm:shrink-0">
                        <label className="sr-only" htmlFor={`player-name-${player.id}`}>
                          Player {index + 1} name
                        </label>
                        <input
                          id={`player-name-${player.id}`}
                          type="text"
                          value={player.name}
                          onChange={(e) => handleNameChange(player.id, e.target.value)}
                          className="min-h-9 min-w-0 flex-1 rounded-lg border border-line/80 bg-deep/60 px-2.5 font-body text-[15px] font-semibold text-text-hi outline-none transition-colors focus-visible:border-steel-blue/50 focus-visible:ring-2 focus-visible:ring-steel-blue/25 sm:w-[140px] sm:flex-none"
                          maxLength={24}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePlayer(player.id)}
                          disabled={players.length <= 3}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line/80 bg-transparent text-text-low transition-colors hover:border-bad/40 hover:bg-bad/5 hover:text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Remove ${player.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={handleAddPlayer}
              disabled={players.length >= 8}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-bright bg-surface/20 px-3 py-3 font-mono text-[13px] text-text-mid transition-all hover:border-steel-blue/40 hover:bg-steel-blue/5 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
            >
              + Add player
            </button>
          </Top100Panel>
        </div>

        <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <Top100Frame
            eyebrow="Step 3 · Category"
            title={gameMode === 'single' ? 'Pick a list' : 'Pick the first list'}
            subtitle="Choose from hundreds of ranked categories — anime, music, sports, and more."
          >
            <CategoryPicker
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              heading=""
              description={categoryDescription}
            />

            <div className="mt-6 border-t border-line/60 pt-6">
              <Top100PrimaryButton onClick={handleStart} disabled={!canStart}>
                {gameMode === 'single' ? 'Start round' : 'Start game'}
              </Top100PrimaryButton>
            </div>
          </Top100Frame>
        </div>
      </div>
    </Top100PageWrap>
  );
}
