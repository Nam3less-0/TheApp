import ScoreHeader from './ScoreHeader';
import TurnSwitcher, { type PlayMode } from './TurnSwitcher';

interface PlayChromeProps {
  round: number;
  misses: number;
  intercepts: number;
  mode: PlayMode;
  onModeChange: (mode: PlayMode) => void;
}

export default function PlayChrome({
  round,
  misses,
  intercepts,
  mode,
  onModeChange,
}: PlayChromeProps) {
  return (
    <div className="mb-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-copper">
          Round {round}
        </span>
        <span className="font-mono text-[11px] text-text-low">
          {mode === 'ours' ? 'Messenger' : 'Intercepting'}
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_280px] lg:items-stretch lg:gap-4">
        <ScoreHeader className="mb-0" misses={misses} intercepts={intercepts} />
        <TurnSwitcher className="mb-0" mode={mode} onChange={onModeChange} />
      </div>
    </div>
  );
}
