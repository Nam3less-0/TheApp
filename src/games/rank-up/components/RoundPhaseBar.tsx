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
  const { local, room, players, turnOrder, turnIndex, roundNumber, awaitingRoundStart } =
    useRankUp();

  if (local.localPhase === 'setup' || !room) return null;

  const myPlayer = players.find((player) => player.id === local.playerId);
  const guessSubmitted =
    local.localPhase === 'guess-submitted' || Boolean(myPlayer?.guessSubmitted);

  const active = stepIndex(local.localPhase, room.phase, guessSubmitted);
  const showTurnMeta = !awaitingRoundStart && turnOrder.length > 0;

  return (
    <div
      className="border-b border-line/60 bg-void/40 px-4 py-2.5"
      aria-label={`Round progress: step ${active + 1} of ${STEPS.length}`}
    >
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-2">
        {showTurnMeta ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6FA3C4]">
            Round {roundNumber} · Turn {turnIndex + 1}/{turnOrder.length}
          </p>
        ) : null}
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {STEPS.map((label, index) => {
            const done = index < active;
            const current = index === active;
            return (
              <div key={label} className="flex items-center gap-1 sm:gap-2">
                {index > 0 ? (
                  <span
                    className={`hidden h-px w-4 sm:block sm:w-8 ${done ? 'bg-[#6FA3C4]/50' : 'bg-line'}`}
                    aria-hidden="true"
                  />
                ) : null}
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] sm:text-[10px] ${
                    current
                      ? 'bg-[#6FA3C4]/15 text-[#6FA3C4] ring-1 ring-[#6FA3C4]/40'
                      : done
                        ? 'text-[#6FA3C4]/70'
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
    </div>
  );
}
