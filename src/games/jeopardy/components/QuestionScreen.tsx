import { useJeopardy } from '../context';
import { COLORS, SILVER_BUTTON, formatScore } from '../utils';
import { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[15px] w-[15px]"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[15px] w-[15px]"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function QuestionScreen() {
  const { state, dispatch } = useJeopardy();
  const cell = state.cells.find((c) => c.id === state.activeCellId);
  const player = state.players[state.currentPlayerIndex];

  if (!cell) return null;

  const topicName = state.columns[cell.columnIndex]?.name ?? '';
  const points = cell.value * (cell.isDouble ? 2 : 1);
  const revealed = state.phase === 'answer';

  return (
    <JeopardyPageWrap>
      <div
        className="overflow-hidden rounded-[18px] border"
        style={{
          borderColor: `color-mix(in srgb, ${COLORS.sapphireBright} 40%, transparent)`,
          boxShadow: `0 0 40px -20px ${COLORS.sapphireBright}`,
        }}
      >
        <div
          className="flex items-center justify-between gap-3 px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.sapphire}, ${COLORS.sapphireDim})`,
          }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/60">
            {topicName}
          </div>
          {cell.isDouble && (
            <div
              className="rounded-[5px] border px-2 py-[3px] font-mono text-[10px]"
              style={{
                background: 'rgba(201,136,59,0.3)',
                borderColor: COLORS.doubleBright,
                color: COLORS.doubleBright,
              }}
            >
              ⚡ DOUBLE TROUBLE
            </div>
          )}
          <div
            className="font-display text-xl font-extrabold"
            style={{ color: COLORS.goldBright }}
          >
            {formatScore(points)}
          </div>
        </div>

        <div
          className="px-[22px] py-7"
          style={{ background: 'linear-gradient(180deg, #222428, #1A1C20)' }}
        >
          {!revealed && (
            <div className="mb-6 flex items-center justify-center gap-2.5">
              <PlayerAvatar name={player?.name ?? ''} size="sm" />
              <span className="font-mono text-xs text-text-mid">
                {player?.name} is answering
              </span>
            </div>
          )}

          <p
            className={`text-center font-body leading-[1.55] ${
              revealed
                ? 'mb-3 text-sm font-medium text-text-mid opacity-50'
                : 'mb-6 text-[17px] font-semibold text-text-hi'
            }`}
          >
            {cell.question}
          </p>

          {!revealed && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'REVEAL_ANSWER' })}
              className="w-full rounded-xl border-none px-4 py-3.5 font-body text-sm font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
              style={{ background: SILVER_BUTTON }}
            >
              Reveal answer
            </button>
          )}
        </div>

        {revealed && (
          <div className="border-t border-line bg-surface px-[22px] py-[18px]">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[1.5px] text-text-low">
              Answer
            </div>
            <div
              className="mb-[18px] font-display text-lg font-bold"
              style={{ color: COLORS.goldBright }}
            >
              {cell.answer}
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESOLVE', correct: true })}
                className="flex flex-1 items-center justify-center gap-[7px] rounded-[11px] border px-3 py-3 font-body text-[13.5px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good"
                style={{
                  background: `color-mix(in srgb, ${COLORS.good} 14%, #1A1C20)`,
                  borderColor: COLORS.good,
                  color: COLORS.good,
                }}
              >
                <CheckIcon />
                {player?.name} got it +{formatScore(points)}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESOLVE', correct: false })}
                className="flex flex-1 items-center justify-center gap-[7px] rounded-[11px] border px-3 py-3 font-body text-[13.5px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad"
                style={{
                  background: `color-mix(in srgb, ${COLORS.bad} 14%, #1A1C20)`,
                  borderColor: COLORS.bad,
                  color: COLORS.bad,
                }}
              >
                <CrossIcon />
                Missed
              </button>
            </div>
          </div>
        )}
      </div>
    </JeopardyPageWrap>
  );
}
