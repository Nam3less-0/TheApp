import { useRankUp } from '../context';

const STEPS = ['Lobby', 'Rank', 'Guess', 'Reveal'] as const;

function stepIndex(
  localPhase: string,
  roomPhase: string | undefined,
  guessSubmitted: boolean,
): number {
  if (localPhase === 'compose' || localPhase === 'ranker-rank') return 1;
  if (roomPhase === 'display' || roomPhase === 'guessing' || guessSubmitted) return 2;
  if (roomPhase === 'reveal') return 3;
  return 0;
}

export default function RoundPhaseBar() {
  const { local, room, players } = useRankUp();

  if (local.localPhase === 'setup' || !room) return null;

  const myPlayer = players.find((player) => player.id === local.playerId);
  const guessSubmitted =
    local.localPhase === 'guess-submitted' || Boolean(myPlayer?.guessSubmitted);

  const active = stepIndex(local.localPhase, room.phase, guessSubmitted);

  return (
    <div
      className="border-b border-line/60 bg-void/40 px-4 py-2.5"
      aria-label={`Round progress: step ${active + 1} of ${STEPS.length}`}
    >
      <div className="mx-auto flex max-w-[900px] items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((label, index) => {
          const done = index < active;
          const current = index === active;
          return (
            <div key={label} className="flex items-center gap-1 sm:gap-2">
              {index > 0 ? (
                <span
                  className={`hidden h-px w-4 sm:block sm:w-8 ${done ? 'bg-pewter/50' : 'bg-line'}`}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] sm:text-[10px] ${
                  current
                    ? 'bg-pewter/20 text-pewter ring-1 ring-pewter/40'
                    : done
                      ? 'text-pewter/70'
                      : 'text-text-low'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
