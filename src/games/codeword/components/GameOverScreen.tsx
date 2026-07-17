import { Link } from 'react-router-dom';
import { useCodeword } from '../context';
import type { InterceptLogEntry, RoundLogEntry } from '../types';
import { drawTeamCard } from '../utils';
import { normalizeHintsHeard } from '../intel-utils';
import CodewordPanel, { CodewordPageWrap } from './CodewordPanel';

function formatCode(code: [number, number, number] | null): string {
  return code ? code.join(' ') : '—';
}

function OurTurnRow({ entry }: { entry: RoundLogEntry }) {
  const correct = entry.outcome === 'correct';
  const hints = entry.hints.filter((h) => h.trim().length > 0);
  return (
    <li className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
      <span className="mt-0.5 w-6 shrink-0 font-mono text-xs text-text-low">
        R{entry.round}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm text-text-hi">{formatCode(entry.code)}</p>
        {hints.length > 0 && (
          <p className="truncate font-body text-[12px] text-text-mid">
            {hints.join(' · ')}
          </p>
        )}
      </div>
      <span
        className={`shrink-0 font-mono text-[11px] ${correct ? 'text-good' : 'text-bad'}`}
      >
        {correct ? 'decoded' : 'miss'}
      </span>
    </li>
  );
}

function InterceptRow({ entry }: { entry: InterceptLogEntry }) {
  const hit = entry.outcome === 'intercepted';
  const hints = normalizeHintsHeard(entry.hintsHeard);
  const pairs = hints
    .map((hint, i) => {
      const trimmed = hint.trim();
      if (!trimmed) return null;
      return `${trimmed} → ${entry.actualCode[i]}`;
    })
    .filter(Boolean);

  return (
    <li className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
      <span className="mt-0.5 w-6 shrink-0 font-mono text-xs text-text-low">
        R{entry.round}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm text-text-hi">
          Code {formatCode(entry.actualCode)}
        </p>
        {pairs.length > 0 && (
          <p className="mt-0.5 font-body text-[12px] text-text-mid">
            {pairs.join(' · ')}
          </p>
        )}
      </div>
      <span
        className={`shrink-0 font-mono text-[11px] ${hit ? 'text-good' : 'text-text-low'}`}
      >
        {hit ? 'intercepted' : 'missed'}
      </span>
    </li>
  );
}

export default function GameOverScreen() {
  const { state, dispatch, synced, resetSyncedGame, opponentTeam } = useCodeword();
  const won = state.gameStatus === 'won';

  function handleNewGame() {
    const card = drawTeamCard();
    if (synced) {
      void resetSyncedGame(card);
    } else {
      dispatch({ type: 'NEW_GAME', card });
    }
  }

  return (
    <CodewordPageWrap>
      <div
        className="mb-5 rounded-2xl border px-5 py-5 text-center"
        style={{
          borderColor: won ? 'rgba(126,217,164,0.4)' : 'rgba(224,139,122,0.4)',
          background: won
            ? 'linear-gradient(165deg, rgba(126,217,164,0.12), rgba(26,28,32,0.6))'
            : 'linear-gradient(165deg, rgba(224,139,122,0.12), rgba(26,28,32,0.6))',
        }}
      >
        <p
          className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: won ? '#7ED9A4' : '#E08B7A' }}
        >
          {won ? 'Victory' : 'Defeat'}
        </p>
        <h1 className="font-display text-2xl font-extrabold tracking-[-0.5px] text-text-hi">
          {won ? 'You won — 2 intercepts!' : 'You lost — 2 miscommunications'}
        </h1>
        <p className="mt-1.5 font-body text-sm text-text-mid">
          {won
            ? synced && opponentTeam
              ? `You cracked ${opponentTeam.name}'s codes twice.`
              : 'You cracked the other team\'s codes twice.'
            : synced && opponentTeam
              ? `${opponentTeam.name} outmaneuvered you — two failed decodes.`
              : 'Your team failed to decode your own codes twice.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CodewordPanel>
          <p className="mb-2.5 font-body text-sm font-bold text-text-hi">
            Our turns{' '}
            <span className="font-mono text-[11px] text-bad">
              {state.ourMisses} miss{state.ourMisses === 1 ? '' : 'es'}
            </span>
          </p>
          {state.ourTurnLog.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {state.ourTurnLog.map((entry, i) => (
                <OurTurnRow key={i} entry={entry} />
              ))}
            </ul>
          ) : (
            <p className="font-body text-[13px] text-text-mid">No turns logged.</p>
          )}
        </CodewordPanel>

        <CodewordPanel>
          <p className="mb-2.5 font-body text-sm font-bold text-text-hi">
            Intercepts{' '}
            <span className="font-mono text-[11px] text-good">
              {state.ourIntercepts} cracked
            </span>
          </p>
          {state.interceptLog.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {state.interceptLog.map((entry, i) => (
                <InterceptRow key={i} entry={entry} />
              ))}
            </ul>
          ) : (
            <p className="font-body text-[13px] text-text-mid">
              No intercepts logged.
            </p>
          )}
        </CodewordPanel>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleNewGame}
          className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
          style={{
            background: 'linear-gradient(180deg, #E2C0A8, #C99A7A 55%, #A87C5E)',
          }}
        >
          New game
        </button>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-2.5 text-center font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          Back to shelf
        </Link>
      </div>
    </CodewordPageWrap>
  );
}
