import { useEffect, useRef, useState } from 'react';
import { useJeopardy } from '../context';
import {
  BOARD_COLUMNS,
  COLORS,
  SILVER_BUTTON,
  boardShapeFor,
  getThemeBundle,
  getTopicSummariesForTheme,
} from '../utils';
import JeopardyPanel, { JeopardyPageWrap } from './JeopardyPanel';

const RESHUFFLE_ANIM_MS = 450;
const RESHUFFLE_CONFIRM_MS = 2200;

export default function TopicPreviewScreen() {
  const { state, dispatch } = useJeopardy();
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [justReshuffled, setJustReshuffled] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);
  const shuffleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rerollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      shuffleTimersRef.current.forEach(clearTimeout);
      if (rerollTimerRef.current) clearTimeout(rerollTimerRef.current);
    };
  }, []);

  function handleReshuffle() {
    if (isReshuffling) return;

    setIsReshuffling(true);
    setJustReshuffled(false);
    dispatch({ type: 'RESHUFFLE_PREVIEW_QUESTIONS' });

    shuffleTimersRef.current.forEach(clearTimeout);
    shuffleTimersRef.current = [
      setTimeout(() => {
        setIsReshuffling(false);
        setJustReshuffled(true);
      }, RESHUFFLE_ANIM_MS),
      setTimeout(() => setJustReshuffled(false), RESHUFFLE_ANIM_MS + RESHUFFLE_CONFIRM_MS),
    ];
  }

  function handleReroll() {
    if (isRerolling || !canReroll) return;
    setIsRerolling(true);
    dispatch({ type: 'REROLL_TOPICS' });
    if (rerollTimerRef.current) clearTimeout(rerollTimerRef.current);
    rerollTimerRef.current = setTimeout(() => setIsRerolling(false), 380);
  }

  const allTopics = getTopicSummariesForTheme(state.settings.themeId);
  const theme = getThemeBundle(state.settings.themeId);
  const shape = boardShapeFor(state.settings);
  const blacklisted = new Set(state.blacklistedTopicIds);
  const eligibleCount = allTopics.filter((t) => !blacklisted.has(t.id)).length;

  const lockedSlots =
    state.lockedPreviewSlots.length === BOARD_COLUMNS
      ? state.lockedPreviewSlots
      : Array.from({ length: BOARD_COLUMNS }, () => false);
  const lockedCount = lockedSlots.filter(Boolean).length;
  const openCount = state.previewColumns.filter((_, index) => !lockedSlots[index]).length;

  const lockedIds = new Set(
    state.previewColumns
      .filter((_, index) => lockedSlots[index])
      .map((column) => column.id),
  );
  const availableForOpen = allTopics.filter(
    (topic) => !blacklisted.has(topic.id) && !lockedIds.has(topic.id),
  ).length;
  const canReroll = openCount > 0 && availableForOpen >= openCount;
  const canStart =
    state.previewColumns.length === BOARD_COLUMNS &&
    state.previewCells.length > 0;

  return (
    <JeopardyPageWrap>
      <div className="mb-8">
        <p
          className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: COLORS.goldBright }}
        >
          Category draft
        </p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[34px]">
          Tonight&apos;s six
        </h1>
        <p className="max-w-xl font-body text-sm leading-relaxed text-text-mid">
          Lock the categories you want to keep, then reroll the rest
          {theme ? ` from the ${theme.name} theme` : ''}. Clues stay hidden until you build the
          board.
        </p>
      </div>

      <JeopardyPanel className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${COLORS.sapphireDim}, transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="relative mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-body text-sm font-bold text-text-hi">Lineup</p>
            <p className="mt-0.5 font-mono text-[11px] text-text-low">
              Tap a padlock to hold a category
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-line bg-deep/60 px-2.5 py-1 font-mono text-[11px] text-text-mid">
              {eligibleCount} in pool
            </span>
            {lockedCount > 0 && (
              <span
                className="rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold"
                style={{
                  borderColor: `${COLORS.gold}66`,
                  color: COLORS.goldBright,
                  background: `${COLORS.goldDim}33`,
                }}
              >
                {lockedCount} locked
              </span>
            )}
          </div>
        </div>

        <ul className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
          {state.previewColumns.map((column, index) => {
            const locked = lockedSlots[index] ?? false;
            return (
              <li
                key={`${column.id}-${index}`}
                className={`group relative overflow-hidden rounded-xl border transition-[transform,border-color,box-shadow] duration-300 ${
                  isRerolling && !locked ? 'scale-[0.985] opacity-70' : 'scale-100 opacity-100'
                }`}
                style={{
                  borderColor: locked ? `${COLORS.gold}99` : 'rgba(255,255,255,0.08)',
                  boxShadow: locked
                    ? `0 0 0 1px ${COLORS.gold}33, 0 8px 28px -12px ${COLORS.goldDim}`
                    : '0 10px 24px -16px rgba(0,0,0,0.55)',
                  background: locked
                    ? `linear-gradient(155deg, ${COLORS.goldDim}55, #1A1C20 55%)`
                    : `linear-gradient(155deg, ${COLORS.sapphireBright}33, ${COLORS.sapphireDim}aa 45%, #15171B)`,
                  transitionDelay: isRerolling && !locked ? `${index * 35}ms` : '0ms',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                  style={{
                    background: locked
                      ? `linear-gradient(90deg, transparent, ${COLORS.goldBright}, transparent)`
                      : `linear-gradient(90deg, transparent, ${COLORS.sapphireBright}, transparent)`,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-stretch gap-0">
                  <div
                    className="flex w-12 shrink-0 flex-col items-center justify-center border-r border-white/5"
                    style={{
                      background: locked
                        ? `linear-gradient(180deg, ${COLORS.gold}33, transparent)`
                        : `linear-gradient(180deg, ${COLORS.sapphire}44, transparent)`,
                    }}
                  >
                    <span
                      className="font-display text-lg font-extrabold tabular-nums leading-none"
                      style={{ color: locked ? COLORS.goldBright : COLORS.sapphireBright }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[15px] font-bold leading-snug tracking-[-0.2px] text-text-hi sm:text-[16px]">
                        {column.name}
                      </p>
                      <p
                        className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                        style={{ color: locked ? COLORS.gold : 'rgba(255,255,255,0.35)' }}
                      >
                        {locked ? 'Locked in' : 'Open to reroll'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: 'TOGGLE_LOCK_PREVIEW_SLOT', slotIndex: index })
                      }
                      aria-pressed={locked}
                      aria-label={`${locked ? 'Unlock' : 'Lock'} ${column.name}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-[background-color,border-color,color,transform] duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue active:scale-95"
                      style={{
                        borderColor: locked ? COLORS.gold : 'rgba(255,255,255,0.12)',
                        color: locked ? COLORS.goldBright : 'rgba(255,255,255,0.55)',
                        background: locked ? `${COLORS.gold}22` : 'rgba(0,0,0,0.25)',
                      }}
                    >
                      <LockIcon locked={locked} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {state.previewColumns.length < BOARD_COLUMNS && (
          <p className="mt-3 rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 font-body text-[13px] text-bad">
            Not enough topics left in the pool to fill the board.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleReroll}
            disabled={!canReroll || isRerolling}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-3.5 font-body text-sm font-semibold text-text-hi transition-colors hover:border-steel-blue/50 hover:bg-steel-blue/10 hover:text-steel-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isRerolling ? (
              <span
                className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-steel-blue/25 border-t-steel-blue"
                aria-hidden="true"
              />
            ) : (
              <DiceIcon />
            )}
            {openCount === BOARD_COLUMNS
              ? 'Reroll all six'
              : openCount === 0
                ? 'All locked'
                : `Reroll ${openCount} open`}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
            className="rounded-xl border border-line px-4 py-3.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue sm:px-5"
          >
            Edit players
          </button>
        </div>

        {!canReroll && openCount > 0 && (
          <p className="mt-2 text-center font-mono text-[10px] text-text-low">
            Not enough unused topics left for the open slots
          </p>
        )}
        {openCount === 0 && state.previewColumns.length === BOARD_COLUMNS && (
          <p className="mt-2 text-center font-mono text-[10px] text-text-low">
            Unlock a category to reroll it
          </p>
        )}

        {state.previewCells.length > 0 && (
          <section
            className={`mt-5 rounded-xl border pt-5 transition-[border-color,background-color,box-shadow] duration-300 ${
              isReshuffling
                ? 'border-steel-blue/50 bg-steel-blue/5 px-4 pb-4 shadow-[0_0_0_1px_rgba(91,143,232,0.15)]'
                : justReshuffled
                  ? 'border-good/35 bg-good/5 px-4 pb-4'
                  : 'border-transparent px-0 pb-0'
            }`}
          >
            <div
              className={`border-line pt-0 ${isReshuffling || justReshuffled ? 'border-t-0' : 'border-t pt-5'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-body text-sm font-bold text-text-hi">Question set</p>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-text-low">
                    Clues stay hidden until the game starts. Reshuffle for a fresh deal on every
                    tile.
                  </p>
                  <p
                    className={`mt-2 font-mono text-[11px] font-semibold transition-opacity duration-300 ${
                      isReshuffling
                        ? 'text-steel-blue opacity-100'
                        : justReshuffled
                          ? 'text-good opacity-100'
                          : 'pointer-events-none opacity-0'
                    }`}
                    aria-live="polite"
                  >
                    {isReshuffling ? 'Dealing a new clue for every tile…' : 'Fresh clue set dealt.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReshuffle}
                  disabled={isReshuffling}
                  aria-busy={isReshuffling}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-steel-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-wait disabled:border-steel-blue/40 disabled:text-steel-blue"
                >
                  {isReshuffling && (
                    <span
                      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-steel-blue/25 border-t-steel-blue"
                      aria-hidden="true"
                    />
                  )}
                  {isReshuffling ? 'Shuffling…' : 'Reshuffle clues'}
                </button>
              </div>

              <div
                className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ${
                  isReshuffling ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isReshuffling}
              >
                <div className="flex flex-wrap gap-1.5">
                  {state.previewColumns.map((column) => (
                    <span
                      key={column.id}
                      className="inline-flex animate-pulse items-center gap-1 rounded-md border border-steel-blue/25 bg-steel-blue/10 px-2 py-1 font-mono text-[10px] text-steel-blue"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-steel-blue" />
                      {column.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5">
          <p className="font-mono text-[11px] leading-relaxed text-text-low">
            {BOARD_COLUMNS} topics · {shape.difficulties.length} clues each ·{' '}
            {shape.doubleCount} double-trouble ·{' '}
            {BOARD_COLUMNS * shape.difficulties.length} clues
            {state.settings.finalJeopardy ? ' · + Final' : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'CONFIRM_TOPICS' })}
          disabled={!canStart}
          className="mt-5 w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: SILVER_BUTTON }}
        >
          Build the board
        </button>
      </JeopardyPanel>
    </JeopardyPageWrap>
  );
}

function LockIcon({ locked }: { locked: boolean }) {
  if (locked) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 11V8a5 5 0 0 1 10 0v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="5"
          y="11"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 9.9-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.4" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
