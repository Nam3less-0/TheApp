import { useEffect, useState } from 'react';
import { useJeopardy } from '../context';
import type { GameSettings, Player } from '../types';
import {
  COLORS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  SILVER_BUTTON,
  THEME_BUNDLES,
  createDefaultPlayers,
  defaultSettings,
  freshLifelines,
} from '../utils';
import JeopardyPanel, { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';

const TIMER_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '45s', value: 45 },
];

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 text-left transition-colors hover:border-line-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-body text-[13.5px] font-bold text-text-hi">
          {label}
        </span>
        <span className="mt-0.5 block font-body text-[11.5px] leading-snug text-text-mid">
          {description}
        </span>
      </span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{
          background: checked
            ? COLORS.sapphireBright
            : 'rgba(220,224,232,0.14)',
        }}
        aria-hidden="true"
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-[left]"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </span>
    </button>
  );
}

export default function SetupScreen() {
  const { state, dispatch } = useJeopardy();
  const [players, setPlayers] = useState<Player[]>(() => {
    if (state.pendingPlayers.length >= MIN_PLAYERS) return state.pendingPlayers;
    if (state.players.length >= MIN_PLAYERS) return state.players;
    return createDefaultPlayers(4);
  });
  const [settings, setSettings] = useState<GameSettings>(
    () => state.settings ?? defaultSettings(),
  );
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (state.phase === 'setup' && state.pendingPlayers.length >= MIN_PLAYERS) {
      setPlayers(state.pendingPlayers);
    }
  }, [state.phase, state.pendingPlayers]);

  const canStart =
    players.length >= MIN_PLAYERS && players.every((p) => p.name.trim().length > 0);

  function patchSettings(patch: Partial<GameSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

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
    dispatch({ type: 'PLAYERS_READY', players, settings });
  }

  return (
    <JeopardyPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        New game
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        Set up your players, tweak the house rules, then preview tonight&apos;s
        categories before the board is built.
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

        <section className="mt-6 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => setShowRules((o) => !o)}
            aria-expanded={showRules}
            className="flex w-full items-center justify-between gap-2 focus-visible:outline-none"
          >
            <span className="font-body text-sm font-bold text-text-hi">
              House rules
            </span>
            <span className="font-mono text-[11px] text-text-low">
              {showRules ? 'Hide ▲' : 'Customize ▼'}
            </span>
          </button>

          {showRules && (
            <div className="mt-4 flex flex-col gap-2.5">
              <Toggle
                label="Quick game"
                description="3 rows instead of 5 — a faster board."
                checked={settings.quickGame}
                onChange={(v) => patchSettings({ quickGame: v })}
              />
              <Toggle
                label="Wrong-answer penalty"
                description="Miss a clue and lose its value (hard mode)."
                checked={settings.wrongAnswerPenalty}
                onChange={(v) => patchSettings({ wrongAnswerPenalty: v })}
              />
              <Toggle
                label="Daily Double wagers"
                description="Bet any amount on Double Trouble tiles."
                checked={settings.dailyDoubleWager}
                onChange={(v) => patchSettings({ dailyDoubleWager: v })}
              />
              <Toggle
                label="Final Jeopardy"
                description="A last secret-wager clue after the board clears."
                checked={settings.finalJeopardy}
                onChange={(v) => patchSettings({ finalJeopardy: v })}
              />
              <Toggle
                label="Self-score"
                description="Players tap their answer; the app judges it."
                checked={settings.selfScore}
                onChange={(v) => patchSettings({ selfScore: v })}
              />
              <Toggle
                label="Sound effects"
                description="Play short cues for picks, reveals and results."
                checked={settings.soundEnabled}
                onChange={(v) => patchSettings({ soundEnabled: v })}
              />

              <div className="mt-1 rounded-xl border border-line bg-surface px-3.5 py-3">
                <p className="mb-2 font-body text-[13.5px] font-bold text-text-hi">
                  Clue timer
                </p>
                <div className="flex gap-2">
                  {TIMER_OPTIONS.map((opt) => {
                    const active = settings.clueTimerSeconds === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => patchSettings({ clueTimerSeconds: opt.value })}
                        className="flex-1 rounded-lg border px-2 py-2 font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                        style={{
                          borderColor: active
                            ? COLORS.sapphireBright
                            : 'rgba(220,224,232,0.12)',
                          color: active ? COLORS.sapphireBright : '#9CA0AA',
                          background: active
                            ? `color-mix(in srgb, ${COLORS.sapphireBright} 12%, transparent)`
                            : 'transparent',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-1 rounded-xl border border-line bg-surface px-3.5 py-3">
                <p className="mb-2 font-body text-[13.5px] font-bold text-text-hi">
                  Theme
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => patchSettings({ themeId: null })}
                    className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                    style={{
                      borderColor: settings.themeId === null ? COLORS.gold : 'rgba(220,224,232,0.12)',
                      color: settings.themeId === null ? COLORS.goldBright : '#9CA0AA',
                    }}
                  >
                    All topics
                  </button>
                  {THEME_BUNDLES.map((theme) => {
                    const active = settings.themeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => patchSettings({ themeId: active ? null : theme.id })}
                        title={theme.description}
                        className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                        style={{
                          borderColor: active ? COLORS.gold : 'rgba(220,224,232,0.12)',
                          color: active ? COLORS.goldBright : '#9CA0AA',
                        }}
                      >
                        {theme.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        <p className="mt-5 font-mono text-[11px] leading-relaxed text-text-low">
          Step 1 of 3 · players &amp; rules · then topic preview · then the board
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
