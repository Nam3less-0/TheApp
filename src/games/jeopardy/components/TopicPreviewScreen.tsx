import { useEffect, useRef, useState } from 'react';
import { useJeopardy } from '../context';
import {
  BOARD_COLUMNS,
  BOARD_SIZE,
  COLORS,
  DIFFICULTIES,
  DOUBLE_TROUBLE_COUNT,
  SILVER_BUTTON,
  getAllTopicSummaries,
} from '../utils';
import JeopardyPanel, { JeopardyPageWrap } from './JeopardyPanel';

const RESHUFFLE_ANIM_MS = 450;
const RESHUFFLE_CONFIRM_MS = 2200;

export default function TopicPreviewScreen() {
  const { state, dispatch } = useJeopardy();
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [justReshuffled, setJustReshuffled] = useState(false);
  const shuffleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      shuffleTimersRef.current.forEach(clearTimeout);
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
  const allTopics = getAllTopicSummaries();
  const blacklisted = new Set(state.blacklistedTopicIds);
  const eligibleCount = allTopics.length - blacklisted.size;
  const currentPreviewIds = new Set(state.previewColumns.map((column) => column.id));
  const hasAlternatives = allTopics.some(
    (topic) => !blacklisted.has(topic.id) && !currentPreviewIds.has(topic.id),
  );
  const canReroll = hasAlternatives;
  const canStart =
    state.previewColumns.length === BOARD_COLUMNS &&
    state.previewCells.length > 0;

  return (
    <JeopardyPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        Choose your topics
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        Six categories were drawn at random, and a fresh clue was dealt for every tile.
        Reroll for new topics, ban ones you never want to see this round, or reshuffle
        the clues below until you like the board — nothing is locked in until you build it.
      </p>

      <JeopardyPanel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="font-body text-sm font-bold text-text-hi">Tonight&apos;s six</p>
          <p className="font-mono text-[11px] text-text-low">
            {eligibleCount} topic{eligibleCount === 1 ? '' : 's'} still in the pool
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {state.previewColumns.map((column, index) => (
            <li
              key={`${column.id}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-xs font-extrabold text-text-hi"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.sapphireBright}, ${COLORS.sapphireDim})`,
                }}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 font-body text-[15px] font-semibold text-text-hi">
                {column.name}
              </span>
              <button
                type="button"
                onClick={() => dispatch({ type: 'BLACKLIST_TOPIC', topicId: column.id })}
                className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-bad/40 hover:text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                aria-label={`Ban ${column.name} from rerolls`}
              >
                Ban
              </button>
            </li>
          ))}
        </ul>

        {state.previewColumns.length < BOARD_COLUMNS && (
          <p className="mt-3 rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 font-body text-[13px] text-bad">
            Not enough topics left after bans — unban some categories to continue.
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => dispatch({ type: 'REROLL_TOPICS' })}
            disabled={!canReroll}
            className="flex-1 rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-hi transition-colors hover:border-steel-blue/40 hover:text-steel-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reroll all six
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
            className="rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            Edit players
          </button>
        </div>

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
                    Clues stay hidden until the game starts. Reshuffle to deal a fresh
                    set for every tile if you want to be sure.
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
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-steel-blue"
                        style={{ animationDelay: '75ms' }}
                      />
                      {column.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {state.blacklistedTopicIds.length > 0 && (
          <section className="mt-5 border-t border-line pt-5">
            <p className="mb-2 font-body text-[13px] font-bold text-text-hi">
              Banned this round ({state.blacklistedTopicIds.length})
            </p>
            <ul className="flex flex-wrap gap-2">
              {state.blacklistedTopicIds.map((topicId) => {
                const topic = allTopics.find((entry) => entry.id === topicId);
                return (
                  <li key={topicId}>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: 'UNBLACKLIST_TOPIC', topicId })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                    >
                      {topic?.name ?? topicId}
                      <span aria-hidden="true">×</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <p className="mt-5 font-mono text-[11px] leading-relaxed text-text-low">
          {BOARD_COLUMNS} topics · {DIFFICULTIES.length} clues each ·{' '}
          {DOUBLE_TROUBLE_COUNT} double-trouble tiles · {BOARD_SIZE} clues total
        </p>

        <button
          type="button"
          onClick={() => dispatch({ type: 'CONFIRM_TOPICS' })}
          disabled={!canStart}
          className="mt-6 w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: SILVER_BUTTON }}
        >
          Build the board
        </button>
      </JeopardyPanel>
    </JeopardyPageWrap>
  );
}
