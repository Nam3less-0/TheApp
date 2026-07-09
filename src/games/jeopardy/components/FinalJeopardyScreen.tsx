import { useEffect, useState } from 'react';
import { useJeopardy } from '../context';
import { COLORS, SILVER_BUTTON, formatScore, maxFinalWager, playSound } from '../utils';
import { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';
import WagerControl from './WagerControl';

export default function FinalJeopardyScreen() {
  const { state, dispatch } = useJeopardy();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (state.phase === 'final-clue') playSound('final', state.settings.soundEnabled);
  }, [state.phase, state.settings.soundEnabled]);

  const clue = state.finalClue;
  if (!clue) return null;

  if (state.phase === 'final-wager') {
    const entry = state.finalWagers[state.finalWagerIndex];
    const player = state.players.find((p) => p.id === entry?.playerId);
    if (!player) return null;
    const max = maxFinalWager(player.score);

    return (
      <JeopardyPageWrap>
        <div className="mb-5 text-center">
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[2px] text-text-low">
            Final Jeopardy · secret wager
          </div>
          <h1 className="font-display text-2xl font-black text-text-hi">
            Category: {clue.topicName}
          </h1>
          <p className="mt-2 font-body text-[13px] text-text-mid">
            Pass the device to {player.name}. Wager in secret — the clue stays
            hidden until everyone has bet.
          </p>
        </div>

        <div
          className="rounded-[18px] border p-5 sm:p-7"
          style={{
            borderColor: `color-mix(in srgb, ${COLORS.gold} 45%, transparent)`,
            background: 'linear-gradient(180deg, #222428, #1A1C20)',
          }}
        >
          <div className="mb-5 flex items-center justify-center gap-2.5">
            <PlayerAvatar name={player.name} size="sm" />
            <span className="font-body text-sm font-semibold text-text-hi">
              {player.name}
            </span>
          </div>

          <WagerControl
            key={player.id}
            min={0}
            max={max}
            initial={0}
            confirmLabel={`Lock in ${player.name}'s wager`}
            hint={`Score ${formatScore(player.score)} · wager up to ${formatScore(max)}`}
            onConfirm={(amount) => dispatch({ type: 'SET_FINAL_WAGER', amount })}
          />
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-text-low">
          Wager {state.finalWagerIndex + 1} of {state.finalWagers.length}
        </p>
      </JeopardyPageWrap>
    );
  }

  // phase === 'final-clue'
  const allResolved = state.finalWagers.every((w) => w.correct !== null);

  return (
    <JeopardyPageWrap>
      <div
        className="rounded-[18px] border"
        style={{
          borderColor: `color-mix(in srgb, ${COLORS.gold} 40%, transparent)`,
          boxShadow: `0 0 40px -20px ${COLORS.goldBright}`,
        }}
      >
        <div
          className="overflow-hidden rounded-t-[18px] px-5 py-4 text-center"
          style={{ background: `linear-gradient(135deg, ${COLORS.goldDim}, #1A1C20)` }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[2px] text-white/70">
            Final Jeopardy
          </div>
          <div className="font-display text-lg font-extrabold" style={{ color: COLORS.goldBright }}>
            {clue.topicName}
          </div>
        </div>

        <div
          className="px-5 py-7"
          style={{ background: 'linear-gradient(180deg, #222428, #1A1C20)' }}
        >
          <p className="mb-6 text-center font-body text-[17px] font-semibold leading-[1.55] text-text-hi">
            {clue.question}
          </p>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full rounded-xl border-none px-4 py-3.5 font-body text-sm font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
              style={{ background: SILVER_BUTTON }}
            >
              Reveal answer
            </button>
          ) : (
            <>
              <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[1.5px] text-text-low">
                Answer
              </div>
              <div
                className="mb-6 text-center font-display text-lg font-bold"
                style={{ color: COLORS.goldBright }}
              >
                {clue.answer}
              </div>

              <div className="flex flex-col gap-2.5">
                {state.finalWagers.map((w) => {
                  const player = state.players.find((p) => p.id === w.playerId);
                  if (!player) return null;
                  return (
                    <div
                      key={w.playerId}
                      className="flex flex-wrap items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5"
                    >
                      <PlayerAvatar name={player.name} size="xs" />
                      <span className="font-body text-[13px] font-bold text-text-hi">
                        {player.name}
                      </span>
                      <span className="font-mono text-[11px] text-text-low">
                        bet {formatScore(w.wager)}
                      </span>
                      <div className="ml-auto flex gap-1.5">
                        {w.correct === null ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                playSound('correct', state.settings.soundEnabled);
                                dispatch({ type: 'RESOLVE_FINAL', playerId: w.playerId, correct: true });
                              }}
                              className="rounded-lg border px-2.5 py-1.5 font-body text-[12px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good"
                              style={{ borderColor: COLORS.good, color: COLORS.good, background: `color-mix(in srgb, ${COLORS.good} 12%, #1A1C20)` }}
                            >
                              +{formatScore(w.wager)}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playSound('wrong', state.settings.soundEnabled);
                                dispatch({ type: 'RESOLVE_FINAL', playerId: w.playerId, correct: false });
                              }}
                              className="rounded-lg border px-2.5 py-1.5 font-body text-[12px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad"
                              style={{ borderColor: COLORS.bad, color: COLORS.bad, background: `color-mix(in srgb, ${COLORS.bad} 12%, #1A1C20)` }}
                            >
                              −{formatScore(w.wager)}
                            </button>
                          </>
                        ) : (
                          <span
                            className="rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-bold"
                            style={{ color: w.correct ? COLORS.good : COLORS.bad }}
                          >
                            {w.correct ? `+${formatScore(w.wager)}` : `−${formatScore(w.wager)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => dispatch({ type: 'FINISH_FINAL' })}
                disabled={!allResolved}
                className="mt-5 w-full rounded-xl border-none px-4 py-3.5 font-body text-sm font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: SILVER_BUTTON }}
              >
                See final results
              </button>
            </>
          )}
        </div>
      </div>
    </JeopardyPageWrap>
  );
}
