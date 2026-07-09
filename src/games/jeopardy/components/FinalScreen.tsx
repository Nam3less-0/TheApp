import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJeopardy } from '../context';
import { COLORS, SILVER_BUTTON, formatScore, getPlayerById } from '../utils';
import { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';

export default function FinalScreen() {
  const { state, dispatch } = useJeopardy();
  const [recapOpen, setRecapOpen] = useState(false);

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter((p) => p.score === topScore);
  const tie = winners.length > 1;

  const doubles = state.history.filter((record) => record.isDouble);
  const playedFinal = state.finalWagers.length > 0;

  function playerName(id: string | null): string {
    return getPlayerById(state.players, id)?.name ?? 'Unknown';
  }

  return (
    <JeopardyPageWrap>
      <div className="mb-[22px] text-center">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[1px] text-text-low">
          Game over · board cleared · {state.questionsAnswered} clues
          {playedFinal ? ' · Final Jeopardy played' : ''}
        </div>
        <div className="font-display text-2xl font-black text-text-hi">
          {tie ? `${topScore.toLocaleString('en-US')}-point tie!` : `${ranked[0]?.name} wins!`}
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-line">
        {ranked.map((player, index) => {
          const first = index === 0 && !tie;
          const details: string[] = [
            `${player.correct} correct`,
            `${player.missed} missed`,
          ];
          if (player.doublesHit > 0) {
            details.push(
              `incl. ${player.doublesHit} double${player.doublesHit > 1 ? 's' : ''}`,
            );
          }
          return (
            <div
              key={player.id}
              className="flex items-center gap-3.5 px-[18px] py-3.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-line"
              style={{
                background: first
                  ? `linear-gradient(165deg, color-mix(in srgb, ${COLORS.goldBright} 10%, #222428), #1A1C20)`
                  : '#1A1C20',
              }}
            >
              <span
                className="w-7 shrink-0 font-display text-base font-extrabold"
                style={{ color: first ? COLORS.goldBright : COLORS.gold }}
              >
                {index + 1}
              </span>
              <PlayerAvatar name={player.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-body text-sm font-bold text-text-hi">
                  {player.name}
                </div>
                <div className="mt-0.5 font-mono text-[10.5px] text-text-low">
                  {details.join(' · ')}
                </div>
              </div>
              <span
                className="font-display text-[17px] font-extrabold tabular-nums"
                style={{ color: first ? COLORS.goldBright : '#9CA0AA' }}
              >
                {formatScore(player.score)}
              </span>
            </div>
          );
        })}
      </div>

      {playedFinal && (
        <section className="mt-5">
          <h2 className="mb-2 font-body text-sm font-bold text-text-hi">
            Final Jeopardy
          </h2>
          <div className="overflow-hidden rounded-[14px] border border-line">
            {state.finalWagers.map((w) => (
              <div
                key={w.playerId}
                className="flex items-center gap-3 px-4 py-2.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-line"
                style={{ background: '#1A1C20' }}
              >
                <PlayerAvatar name={playerName(w.playerId)} size="xs" />
                <span className="min-w-0 flex-1 truncate font-body text-[13px] font-semibold text-text-hi">
                  {playerName(w.playerId)}
                </span>
                <span className="font-mono text-[11px] text-text-low">
                  bet {formatScore(w.wager)}
                </span>
                <span
                  className="font-mono text-[12px] font-bold tabular-nums"
                  style={{ color: w.correct ? COLORS.good : COLORS.bad }}
                >
                  {w.correct ? `+${formatScore(w.wager)}` : `−${formatScore(w.wager)}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {doubles.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 font-body text-sm font-bold text-text-hi">
            Double Trouble tiles
          </h2>
          <div className="flex flex-col gap-2">
            {doubles.map((record) => (
              <div
                key={record.cellId}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5"
              >
                <span
                  className="font-body text-[11px]"
                  style={{ color: record.correct ? COLORS.doubleBright : COLORS.bad }}
                  aria-hidden="true"
                >
                  ⚡
                </span>
                <span className="min-w-0 flex-1 truncate font-body text-[12.5px] text-text-mid">
                  <span className="font-semibold text-text-hi">{record.topicName}</span>{' '}
                  · {playerName(record.playerId)}
                </span>
                <span
                  className="font-mono text-[11.5px] font-bold tabular-nums"
                  style={{ color: record.awarded >= 0 ? COLORS.good : COLORS.bad }}
                >
                  {record.awarded >= 0 ? '+' : '−'}
                  {formatScore(Math.abs(record.awarded))}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {state.history.length > 0 && (
        <section className="mt-5">
          <button
            type="button"
            onClick={() => setRecapOpen((o) => !o)}
            aria-expanded={recapOpen}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3.5 py-3 text-left transition-colors hover:border-line-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            <span className="font-body text-sm font-bold text-text-hi">
              Full game recap ({state.history.length} clues)
            </span>
            <span className="font-mono text-[11px] text-text-low">
              {recapOpen ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>

          {recapOpen && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {state.history.map((record, index) => (
                <li
                  key={`${record.cellId}-${index}`}
                  className="flex items-center gap-2.5 rounded-lg border border-line bg-deep px-3 py-2"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold"
                    style={{
                      background: record.correct
                        ? `color-mix(in srgb, ${COLORS.good} 20%, #1A1C20)`
                        : `color-mix(in srgb, ${COLORS.bad} 20%, #1A1C20)`,
                      color: record.correct ? COLORS.good : COLORS.bad,
                    }}
                    aria-hidden="true"
                  >
                    {record.correct ? '✓' : '✕'}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-body text-[12px] font-semibold text-text-hi">
                      {record.topicName} · {formatScore(record.value)}
                      {record.isDouble ? ' ⚡' : ''}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-text-low">
                      {playerName(record.playerId)}
                      {record.helperId ? ` + ${playerName(record.helperId)}` : ''}
                      {record.sniped ? ' · sniped' : ''}
                      {record.wager !== null ? ` · wagered ${formatScore(record.wager)}` : ''}
                    </span>
                  </span>
                  <span
                    className="shrink-0 font-mono text-[11px] font-bold tabular-nums"
                    style={{ color: record.awarded >= 0 ? COLORS.good : COLORS.bad }}
                  >
                    {record.awarded >= 0 ? '+' : '−'}
                    {formatScore(Math.abs(record.awarded))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
          className="w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          style={{ background: SILVER_BUTTON }}
        >
          Play again
        </button>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-3 text-center font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
        >
          Back to shelf
        </Link>
      </div>
    </JeopardyPageWrap>
  );
}
