import ScoreHeader from './ScoreHeader';
import TurnSwitcher, { type PlayMode } from './TurnSwitcher';

interface PlayChromeProps {
  round: number;
  misses: number;
  intercepts: number;
  mode: PlayMode;
  onModeChange?: (mode: PlayMode) => void;
  opponentName?: string;
}

export default function PlayChrome({
  round,
  misses,
  intercepts,
  mode,
  onModeChange,
  opponentName,
}: PlayChromeProps) {
  return (
    <div className="mb-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-copper">
          Round {round}
        </span>
        <span className="font-mono text-[11px] text-text-low">
          {mode === 'ours'
            ? 'Messenger'
            : opponentName
              ? `Intercepting ${opponentName}`
              : 'Intercepting'}
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_280px] lg:items-stretch lg:gap-4">
        <ScoreHeader className="mb-0" misses={misses} intercepts={intercepts} />
        {onModeChange ? (
          <TurnSwitcher className="mb-0" mode={mode} onChange={onModeChange} />
        ) : (
          <div
            className="mb-0 flex min-h-[48px] items-center justify-center rounded-2xl border border-line px-3 py-1.5"
            style={{
              background: 'linear-gradient(180deg, #1A1C20, #131417)',
            }}
          >
            <span className="font-body text-sm font-bold text-text-hi">
              {mode === 'ours' ? 'Your turn to transmit' : 'Intercept their code'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
