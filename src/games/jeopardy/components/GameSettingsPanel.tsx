import { useState, type ReactNode } from 'react';
import type { GameSettings } from '../types';
import {
  COLORS,
  DOUBLE_TROUBLE_COUNT,
  LIFELINE_USES_CAP,
  MISDIRECT_CHANCE_PRESETS,
  QUICK_DOUBLE_TROUBLE_COUNT,
  THEME_BUNDLES,
  boardShapeFor,
} from '../utils';

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

function Stepper({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
      <span className="min-w-0 flex-1">
        <span className="block font-body text-[13.5px] font-bold text-text-hi">
          {label}
        </span>
        <span className="mt-0.5 block font-body text-[11.5px] leading-snug text-text-mid">
          {description}
        </span>
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line font-mono text-[16px] text-text-hi transition-colors hover:border-steel-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-7 text-center font-mono text-[14px] font-bold tabular-nums text-text-hi">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line font-mono text-[16px] text-text-hi transition-colors hover:border-steel-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel-blue"
      >
        <span className="min-w-0">
          <span className="block font-body text-[13.5px] font-bold text-text-hi">
            {title}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] leading-relaxed text-text-low">
            {summary}
          </span>
        </span>
        <span className="shrink-0 pt-0.5 font-mono text-[11px] text-text-low">
          {open ? 'Hide ▲' : 'Open ▼'}
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-2.5 border-t border-line px-2.5 py-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

type SettingsSectionId =
  | 'board'
  | 'powerups'
  | 'scoring'
  | 'payouts'
  | 'dynamics';

function compactList(items: Array<string | null>): string {
  const on = items.filter((item): item is string => Boolean(item));
  return on.length > 0 ? on.join(' · ') : 'Classic';
}

function boardSummary(settings: GameSettings): string {
  const theme =
    THEME_BUNDLES.find((bundle) => bundle.id === settings.themeId)?.name ??
    'All topics';
  const misdirect =
    MISDIRECT_CHANCE_PRESETS.find((p) => p.value === settings.misdirectChance)
      ?.label ?? 'Off';
  return compactList([
    settings.quickGame ? 'quick' : '5 rows',
    `${settings.doubleTroubleCount} doubles`,
    settings.tripleTrouble ? 'triple' : null,
    misdirect !== 'Off' ? `misdirects ${misdirect.toLowerCase()}` : null,
    theme,
  ]);
}

function powerUpSummary(settings: GameSettings): string {
  return `${settings.phoneAFriendUses} phone · ${settings.whatChoicesUses} choices · ${settings.snipeUses} snipe`;
}

function scoringSummary(settings: GameSettings): string {
  const timer =
    settings.clueTimerSeconds > 0 ? `${settings.clueTimerSeconds}s timer` : null;
  return compactList([
    settings.wrongAnswerPenalty ? 'penalty' : null,
    settings.dailyDoubleWager ? 'DD wagers' : null,
    settings.hotStreak ? 'streaks' : null,
    settings.underdogBoost ? 'underdog' : null,
    settings.lifelineTax ? 'lifeline tax' : null,
    settings.topRowWager ? 'top wager' : null,
    settings.trueDailyDouble ? 'all-in' : null,
    settings.finalJeopardy ? 'final' : null,
    settings.selfScore ? 'self-score' : null,
    settings.soundEnabled ? null : 'sound off',
    timer,
  ]);
}

function payoutsSummary(settings: GameSettings): string {
  return compactList([
    settings.jackpotTile ? 'jackpot' : null,
    settings.missPot ? 'pot' : null,
    settings.categorySweep ? 'sweeps' : null,
    settings.boardInflation ? 'inflation' : null,
    settings.invertedValues ? 'inverted' : null,
    settings.hiddenValues ? 'mystery $' : null,
    settings.leaderTax ? 'leader tax' : null,
    settings.scoreFloor ? 'no debt' : null,
  ]);
}

function dynamicsSummary(settings: GameSettings): string {
  return compactList([
    settings.hiddenCategories ? 'mystery cats' : null,
    settings.strictRotation ? 'rotate' : null,
    settings.secondWind ? '2nd wind' : null,
    settings.freeLowTiles ? 'free lows' : null,
    settings.lightningFinish ? 'lightning' : null,
    settings.lowestPicksOnMiss ? 'lowest picks' : null,
    settings.openPicking ? 'open pick' : null,
  ]);
}

export default function GameSettingsPanel({
  settings,
  onChange,
}: {
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
}) {
  const shape = boardShapeFor(settings);
  const maxDoubles = shape.difficulties.length * 6;
  const [openSection, setOpenSection] = useState<SettingsSectionId | null>(null);

  function toggleSection(id: SettingsSectionId) {
    setOpenSection((current) => (current === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2">
      <CollapsibleSection
        title="Board"
        summary={boardSummary(settings)}
        open={openSection === 'board'}
        onToggle={() => toggleSection('board')}
      >
        <Toggle
          label="Quick game"
          description="3 rows instead of 5 — a faster board."
          checked={settings.quickGame}
          onChange={(v) => {
            const maxDoublesForMode = (v ? 3 : 5) * 6;
            let count = Math.min(settings.doubleTroubleCount, maxDoublesForMode);
            if (v && settings.doubleTroubleCount === DOUBLE_TROUBLE_COUNT) {
              count = QUICK_DOUBLE_TROUBLE_COUNT;
            } else if (
              !v &&
              settings.doubleTroubleCount === QUICK_DOUBLE_TROUBLE_COUNT
            ) {
              count = DOUBLE_TROUBLE_COUNT;
            }
            onChange({ quickGame: v, doubleTroubleCount: count });
          }}
        />
        <Stepper
          label="Double Trouble tiles"
          description={`Hidden 2× (or 3×) tiles planted at random. Max ${maxDoubles} on this board.`}
          value={Math.min(settings.doubleTroubleCount, maxDoubles)}
          min={0}
          max={maxDoubles}
          onChange={(v) => onChange({ doubleTroubleCount: v })}
        />
        <Toggle
          label="Triple Trouble"
          description="Those tiles pay 3× instead of 2×."
          checked={settings.tripleTrouble}
          onChange={(v) => onChange({ tripleTrouble: v })}
        />

        <div className="rounded-xl border border-line bg-deep/40 px-3.5 py-3">
          <p className="mb-1 font-body text-[13.5px] font-bold text-text-hi">
            Misdirect cards
          </p>
          <p className="mb-3 font-body text-[11.5px] leading-snug text-text-mid">
            Some tiles secretly use another board category at the same dollar
            value. The card still shows the column you picked, then flags the
            real topic. Reshuffles stay in that new topic.
          </p>
          <div className="flex gap-2">
            {MISDIRECT_CHANCE_PRESETS.map((opt) => {
              const active = settings.misdirectChance === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  title={opt.hint}
                  onClick={() => onChange({ misdirectChance: opt.value })}
                  className="flex-1 rounded-lg border px-2 py-2 font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                  style={{
                    borderColor: active
                      ? COLORS.gold
                      : 'rgba(220,224,232,0.12)',
                    color: active ? COLORS.goldBright : '#9CA0AA',
                    background: active
                      ? `color-mix(in srgb, ${COLORS.gold} 12%, transparent)`
                      : 'transparent',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-deep/40 px-3.5 py-3">
          <p className="mb-2 font-body text-[13.5px] font-bold text-text-hi">
            Theme
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChange({ themeId: null })}
              className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
              style={{
                borderColor:
                  settings.themeId === null
                    ? COLORS.gold
                    : 'rgba(220,224,232,0.12)',
                color:
                  settings.themeId === null ? COLORS.goldBright : '#9CA0AA',
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
                  onClick={() => onChange({ themeId: active ? null : theme.id })}
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
      </CollapsibleSection>

      <CollapsibleSection
        title="Power-ups"
        summary={powerUpSummary(settings)}
        open={openSection === 'powerups'}
        onToggle={() => toggleSection('powerups')}
      >
        <Stepper
          label="Phone a Friend"
          description="Split the points with a helper on a clue."
          value={settings.phoneAFriendUses}
          min={0}
          max={LIFELINE_USES_CAP}
          onChange={(v) => onChange({ phoneAFriendUses: v })}
        />
        <Stepper
          label="What Choices"
          description="Reveal multiple-choice options for a clue."
          value={settings.whatChoicesUses}
          min={0}
          max={LIFELINE_USES_CAP}
          onChange={(v) => onChange({ whatChoicesUses: v })}
        />
        <Stepper
          label="Snipe"
          description="Steal another player's tile before they answer."
          value={settings.snipeUses}
          min={0}
          max={LIFELINE_USES_CAP}
          onChange={(v) => onChange({ snipeUses: v })}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Scoring & flow"
        summary={scoringSummary(settings)}
        open={openSection === 'scoring'}
        onToggle={() => toggleSection('scoring')}
      >
        <Toggle
          label="Wrong-answer penalty"
          description="Miss a clue and lose its value (hard mode)."
          checked={settings.wrongAnswerPenalty}
          onChange={(v) => onChange({ wrongAnswerPenalty: v })}
        />
        <Toggle
          label="Daily Double wagers"
          description="Bet any amount on Double Trouble tiles."
          checked={settings.dailyDoubleWager}
          onChange={(v) => onChange({ dailyDoubleWager: v })}
        />
        <Toggle
          label="Hot streak"
          description="Each correct answer in a row after the first is worth +$100 extra."
          checked={settings.hotStreak}
          onChange={(v) => onChange({ hotStreak: v })}
        />
        <Toggle
          label="Underdog boost"
          description="If you're not in the lead, a correct answer is worth 50% more."
          checked={settings.underdogBoost}
          onChange={(v) => onChange({ underdogBoost: v })}
        />
        <Toggle
          label="Lifeline tax"
          description="Phone a Friend and What Choices each cost $100."
          checked={settings.lifelineTax}
          onChange={(v) => onChange({ lifelineTax: v })}
        />
        <Toggle
          label="Wager the top row"
          description="Every highest-value tile pauses for a bet, not just Double Trouble."
          checked={settings.topRowWager}
          onChange={(v) => onChange({ topRowWager: v })}
        />
        <Toggle
          label="True Daily Double"
          description="Wagered tiles skip the slider — you're automatically all-in."
          checked={settings.trueDailyDouble}
          onChange={(v) => onChange({ trueDailyDouble: v })}
        />
        <Toggle
          label="Final Jeopardy"
          description="A last secret-wager clue after the board clears."
          checked={settings.finalJeopardy}
          onChange={(v) => onChange({ finalJeopardy: v })}
        />
        <Toggle
          label="Self-score"
          description="Players tap their answer; the app judges it."
          checked={settings.selfScore}
          onChange={(v) => onChange({ selfScore: v })}
        />
        <Toggle
          label="Sound effects"
          description="Play short cues for picks, reveals and results."
          checked={settings.soundEnabled}
          onChange={(v) => onChange({ soundEnabled: v })}
        />
        <div className="rounded-xl border border-line bg-deep/40 px-3.5 py-3">
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
                  onClick={() => onChange({ clueTimerSeconds: opt.value })}
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
      </CollapsibleSection>

      <CollapsibleSection
        title="Payouts"
        summary={payoutsSummary(settings)}
        open={openSection === 'payouts'}
        onToggle={() => toggleSection('payouts')}
      >
        <Toggle
          label="Jackpot tile"
          description="One hidden tile pays an extra $500 if you get it right."
          checked={settings.jackpotTile}
          onChange={(v) => onChange({ jackpotTile: v })}
        />
        <Toggle
          label="The pot"
          description="Missed tile values pile up. The next player who hits takes the pot."
          checked={settings.missPot}
          onChange={(v) => onChange({ missPot: v })}
        />
        <Toggle
          label="Category sweep"
          description="Get the last remaining tile in a topic right and pocket an extra $500."
          checked={settings.categorySweep}
          onChange={(v) => onChange({ categorySweep: v })}
        />
        <Toggle
          label="Board inflation"
          description="Once half the board is gone, remaining tiles pay 1.5×. Last 6 pay 2×."
          checked={settings.boardInflation}
          onChange={(v) => onChange({ boardInflation: v })}
        />
        <Toggle
          label="Inverted board"
          description="Easy tiles pay $1000, hard tiles pay $200. Knowledge is cheap, speed isn't."
          checked={settings.invertedValues}
          onChange={(v) => onChange({ invertedValues: v })}
        />
        <Toggle
          label="Mystery values"
          description="Dollar amounts stay ??? until you open the tile."
          checked={settings.hiddenValues}
          onChange={(v) => onChange({ hiddenValues: v })}
        />
        <Toggle
          label="Leader tax"
          description="If you're in first, a correct answer is only worth half."
          checked={settings.leaderTax}
          onChange={(v) => onChange({ leaderTax: v })}
        />
        <Toggle
          label="Can't go negative"
          description="Scores floor at $0. Big misses can't bury you."
          checked={settings.scoreFloor}
          onChange={(v) => onChange({ scoreFloor: v })}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Dynamics"
        summary={dynamicsSummary(settings)}
        open={openSection === 'dynamics'}
        onToggle={() => toggleSection('dynamics')}
      >
        <Toggle
          label="Mystery categories"
          description="Column names stay ??? until someone finishes a clue there."
          checked={settings.hiddenCategories}
          onChange={(v) => onChange({ hiddenCategories: v })}
        />
        <Toggle
          label="Strict rotation"
          description="The pick always passes, even if you get it right. No running the board."
          checked={settings.strictRotation}
          onChange={(v) => onChange({ strictRotation: v })}
        />
        <Toggle
          label="Second wind"
          description="Each player may miss once without losing the turn."
          checked={settings.secondWind}
          onChange={(v) => onChange({ secondWind: v })}
        />
        <Toggle
          label="Free low tiles"
          description="You can pick more than one $200 and $400 in the same turn."
          checked={settings.freeLowTiles}
          onChange={(v) => onChange({ freeLowTiles: v })}
        />
        <Toggle
          label="Lightning finish"
          description="When 6 tiles remain, every clue is on a 15-second clock."
          checked={settings.lightningFinish}
          onChange={(v) => onChange({ lightningFinish: v })}
        />
        <Toggle
          label="Lowest score picks"
          description="After a miss, the player who's losing chooses next."
          checked={settings.lowestPicksOnMiss}
          onChange={(v) => onChange({ lowestPicksOnMiss: v })}
        />
        <Toggle
          label="Open picking"
          description="On the board, tap a player to hand them the next pick."
          checked={settings.openPicking}
          onChange={(v) => onChange({ openPicking: v })}
        />
      </CollapsibleSection>
    </div>
  );
}

export function settingsSummary(settings: GameSettings): string {
  const misdirect =
    MISDIRECT_CHANCE_PRESETS.find((p) => p.value === settings.misdirectChance)
      ?.label ?? 'Off';
  const extras = [
    settings.tripleTrouble ? 'triple' : null,
    settings.hotStreak ? 'streaks' : null,
    settings.underdogBoost ? 'underdog' : null,
    settings.jackpotTile ? 'jackpot' : null,
    settings.strictRotation ? 'rotate' : null,
    settings.secondWind ? '2nd wind' : null,
    settings.lightningFinish ? 'lightning' : null,
    settings.hiddenCategories ? 'mystery cats' : null,
    settings.openPicking ? 'open pick' : null,
    settings.lowestPicksOnMiss ? 'lowest picks' : null,
    settings.freeLowTiles ? 'free lows' : null,
    settings.lifelineTax ? 'lifeline tax' : null,
    settings.topRowWager ? 'top wager' : null,
    settings.trueDailyDouble ? 'all-in' : null,
    settings.missPot ? 'pot' : null,
    settings.categorySweep ? 'sweeps' : null,
    settings.boardInflation ? 'inflation' : null,
    settings.invertedValues ? 'inverted' : null,
    settings.hiddenValues ? 'mystery $' : null,
    settings.leaderTax ? 'leader tax' : null,
    settings.scoreFloor ? 'no debt' : null,
    misdirect !== 'Off' ? `misdirects ${misdirect.toLowerCase()}` : null,
  ].filter(Boolean);
  return [
    `${settings.phoneAFriendUses} phone`,
    `${settings.whatChoicesUses} choices`,
    `${settings.snipeUses} snipe`,
    `${settings.doubleTroubleCount} doubles`,
    ...extras,
  ].join(' · ');
}
