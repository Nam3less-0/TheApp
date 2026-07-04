import { useEffect, useState } from 'react';
import { useJeopardy } from '../context';
import { COLORS, SILVER_BUTTON, formatScore, isWhatChoicesAllowed } from '../utils';
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

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function ChoicesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

const OPTION_LABELS = ['A', 'B', 'C'];

export default function QuestionScreen() {
  const { state, dispatch } = useJeopardy();
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setPickerOpen(false);
  }, [state.activeCellId]);

  const cell = state.cells.find((c) => c.id === state.activeCellId);
  const player = state.players[state.currentPlayerIndex];

  if (!cell) return null;

  const topicName = state.columns[cell.columnIndex]?.name ?? '';
  const topicId = state.columns[cell.columnIndex]?.id;
  const whatChoicesAllowed = isWhatChoicesAllowed(topicId);
  const points = cell.value * (cell.isDouble ? 2 : 1);
  const revealed = state.phase === 'answer';

  const correctChoice = cell.choices[0];
  const choices = state.revealedChoices;
  const helper = state.players.find((p) => p.id === state.phoneFriendId) ?? null;
  const others = state.players.filter((p) => p.id !== player?.id);

  const lifelines = player?.lifelines ?? { phoneAFriend: false, whatChoices: false };
  const splitShare = Math.round(points / 2);

  return (
    <JeopardyPageWrap>
      <div
        className="rounded-[18px] border"
        style={{
          borderColor: `color-mix(in srgb, ${COLORS.sapphireBright} 40%, transparent)`,
          boxShadow: `0 0 40px -20px ${COLORS.sapphireBright}`,
        }}
      >
        <div
          className="overflow-hidden rounded-t-[18px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-4 py-3.5 sm:px-5 sm:py-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.sapphire}, ${COLORS.sapphireDim})`,
          }}
        >
          <div className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[1.5px] text-white/60">
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
          className={`px-4 py-6 sm:px-[22px] sm:py-7${revealed ? '' : ' rounded-b-[18px]'}`}
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

          {helper && (
            <div
              className="mb-5 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center font-body text-[12.5px] font-semibold"
              style={{
                background: `color-mix(in srgb, ${COLORS.gold} 12%, #1A1C20)`,
                borderColor: `color-mix(in srgb, ${COLORS.goldBright} 45%, transparent)`,
                color: COLORS.goldBright,
              }}
            >
              <PhoneIcon />
              {helper.name} is helping — points split{' '}
              {formatScore(splitShare)} / {formatScore(points - splitShare)}
            </div>
          )}

          {choices && (
            <div className="mb-6 grid gap-2.5 sm:grid-cols-3">
              {choices.map((option, i) => {
                const isCorrect = option === correctChoice;
                const highlight = revealed && isCorrect;
                const dimmed = revealed && !isCorrect;
                return (
                  <div
                    key={`${option}-${i}`}
                    className="flex items-start gap-2 rounded-xl border px-3 py-2.5 font-body text-[13px] font-medium transition-colors"
                    style={{
                      background: highlight
                        ? `color-mix(in srgb, ${COLORS.good} 16%, #1A1C20)`
                        : 'rgba(255,255,255,0.03)',
                      borderColor: highlight
                        ? COLORS.good
                        : 'rgba(220,224,232,0.12)',
                      color: highlight ? COLORS.good : dimmed ? '#5E626C' : '#ECEEF2',
                      opacity: dimmed ? 0.55 : 1,
                    }}
                  >
                    <span
                      className="mt-px font-mono text-[10px] font-bold"
                      style={{ color: highlight ? COLORS.good : COLORS.gold }}
                    >
                      {OPTION_LABELS[i]}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>
                );
              })}
            </div>
          )}

          {!revealed && (
            <>
              <div className="mb-3.5">
                <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[1.5px] text-text-low">
                  Lifelines
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {whatChoicesAllowed ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPickerOpen(false);
                        dispatch({ type: 'USE_WHAT_CHOICES' });
                      }}
                      disabled={!lifelines.whatChoices || choices !== null}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 font-body text-[12.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-35"
                      style={{
                        background: `color-mix(in srgb, ${COLORS.sapphireBright} 10%, #1A1C20)`,
                        borderColor: `color-mix(in srgb, ${COLORS.sapphireBright} 35%, transparent)`,
                        color: COLORS.sapphireBright,
                      }}
                    >
                      <ChoicesIcon />
                      What Choices
                      {!lifelines.whatChoices && (
                        <span className="font-mono text-[10px] opacity-70">· used</span>
                      )}
                    </button>
                  ) : (
                    <p className="flex flex-1 items-center justify-center rounded-xl border border-line bg-deep/60 px-3 py-2.5 text-center font-body text-[11.5px] text-text-low">
                      What Choices isn&rsquo;t available on riddles
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setPickerOpen((o) => !o)}
                    disabled={!lifelines.phoneAFriend || helper !== null}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 font-body text-[12.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-35"
                    style={{
                      background: pickerOpen
                        ? `color-mix(in srgb, ${COLORS.goldBright} 18%, #1A1C20)`
                        : `color-mix(in srgb, ${COLORS.gold} 10%, #1A1C20)`,
                      borderColor: `color-mix(in srgb, ${COLORS.goldBright} 38%, transparent)`,
                      color: COLORS.goldBright,
                    }}
                  >
                    <PhoneIcon />
                    Phone a Friend
                    {!lifelines.phoneAFriend && (
                      <span className="font-mono text-[10px] opacity-70">· used</span>
                    )}
                  </button>
                </div>

                {pickerOpen && lifelines.phoneAFriend && !helper && (
                  <div
                    className="mt-2.5 rounded-xl border border-line bg-surface p-2.5"
                    style={{ boxShadow: '0 8px 24px -12px rgba(0,0,0,0.65)' }}
                  >
                    <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-text-low">
                      Call who?
                    </div>
                    <div className="flex flex-col gap-1">
                      {others.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            dispatch({
                              type: 'USE_PHONE_A_FRIEND',
                              helperId: p.id,
                            });
                            setPickerOpen(false);
                          }}
                          className="flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left font-body text-[13px] font-semibold text-text-hi transition-colors hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                        >
                          <PlayerAvatar name={p.name} size="xs" />
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPickerOpen(false);
                  dispatch({ type: 'REVEAL_ANSWER' });
                }}
                className="w-full rounded-xl border-none px-4 py-3.5 font-body text-sm font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                style={{ background: SILVER_BUTTON }}
              >
                Reveal answer
              </button>
            </>
          )}
        </div>

        {revealed && (
          <div className="overflow-hidden rounded-b-[18px] border-t border-line bg-surface px-4 py-4 sm:px-[22px] sm:py-[18px]">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[1.5px] text-text-low">
              Answer
            </div>
            <div
              className="mb-[18px] font-display text-lg font-bold"
              style={{ color: COLORS.goldBright }}
            >
              {cell.answer}
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESOLVE', correct: true })}
                className="flex flex-1 items-center justify-center gap-[7px] rounded-[11px] border px-3 py-3 text-center font-body text-[13.5px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good"
                style={{
                  background: `color-mix(in srgb, ${COLORS.good} 14%, #1A1C20)`,
                  borderColor: COLORS.good,
                  color: COLORS.good,
                }}
              >
                <CheckIcon />
                {helper
                  ? `Correct · split +${formatScore(splitShare)} each`
                  : `${player?.name} got it +${formatScore(points)}`}
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
