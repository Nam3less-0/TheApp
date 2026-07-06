import type { TeamId } from '../types';

interface ScoreboardProps {
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  activeTeam: TeamId;
  /** When false, the active-team highlight is hidden (e.g. on the game-over screen). */
  showActive?: boolean;
}

function TeamCard({
  name,
  score,
  active,
}: {
  name: string;
  score: number;
  active: boolean;
}) {
  return (
    <div
      className="flex-1 rounded-lg border px-4 py-3 text-center transition-colors"
      style={{
        borderColor: active ? 'var(--hoc-brass)' : 'var(--hoc-line)',
        background: active ? 'var(--hoc-panel-raised)' : 'var(--hoc-panel)',
        boxShadow: active ? '0 0 0 1px var(--hoc-brass), 0 6px 18px rgba(169,133,58,0.15)' : 'none',
      }}
    >
      <p
        className="truncate font-body text-sm font-semibold"
        style={{ color: active ? 'var(--hoc-ivory)' : 'var(--hoc-ivory-dim)' }}
      >
        {name}
      </p>
      <p
        className="mt-1 font-display text-3xl font-extrabold tabular-nums"
        style={{ color: score < 0 ? 'var(--hoc-bad)' : 'var(--hoc-ivory)' }}
      >
        {score}
      </p>
      {active ? (
        <p
          className="hoc-active-pulse mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: 'var(--hoc-brass)' }}
        >
          Your turn
        </p>
      ) : (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-0" aria-hidden="true">
          .
        </p>
      )}
    </div>
  );
}

export default function Scoreboard({
  teamAName,
  teamBName,
  scoreA,
  scoreB,
  activeTeam,
  showActive = true,
}: ScoreboardProps) {
  return (
    <div className="flex items-stretch gap-3">
      <TeamCard name={teamAName} score={scoreA} active={showActive && activeTeam === 'a'} />
      <div
        className="flex items-center font-display text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--hoc-pewter)' }}
        aria-hidden="true"
      >
        vs
      </div>
      <TeamCard name={teamBName} score={scoreB} active={showActive && activeTeam === 'b'} />
    </div>
  );
}
