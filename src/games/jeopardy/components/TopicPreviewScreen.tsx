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

export default function TopicPreviewScreen() {
  const { state, dispatch } = useJeopardy();
  const allTopics = getAllTopicSummaries();
  const blacklisted = new Set(state.blacklistedTopicIds);
  const eligibleCount = allTopics.length - blacklisted.size;
  const currentPreviewIds = new Set(state.previewColumns.map((column) => column.id));
  const hasAlternatives = allTopics.some(
    (topic) => !blacklisted.has(topic.id) && !currentPreviewIds.has(topic.id),
  );
  const canReroll = hasAlternatives;
  const canStart = state.previewColumns.length === BOARD_COLUMNS;

  return (
    <JeopardyPageWrap>
      <h1 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        Choose your topics
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        Six categories were drawn at random. Reroll for a fresh set, or ban topics you
        never want to see again this round — banned topics stay out of every reroll.
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
