import { useRankUp } from '../context';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RankerWaitScreen() {
  const { room, players, submittedCount, guesserCount, revealRound } = useRankUp();

  if (!room?.prompt) return null;

  return (
    <RankUpPageWrap>
      <header className="mb-6 text-center">
        <h1 className="font-display text-[26px] font-extrabold text-text-hi">Waiting for guesses</h1>
        <p className="mt-2 font-body text-sm text-text-mid">{room.prompt}</p>
      </header>

      <RankUpPanel compact className="mb-6">
        <p className="mb-4 text-center font-mono text-3xl font-bold text-pewter">
          {submittedCount}/{guesserCount}
        </p>
        <p className="text-center font-body text-sm text-text-mid">guessers have locked in</p>
        <ul className="mt-4 flex flex-col gap-2">
          {players
            .filter((player) => player.id !== room.rankerPlayerId)
            .map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between rounded-lg border border-line px-3 py-2"
              >
                <span className="font-body text-sm text-text-hi">{player.name}</span>
                <span
                  className={`font-mono text-[11px] ${player.guessSubmitted ? 'text-good' : 'text-text-low'}`}
                >
                  {player.guessSubmitted ? 'Done' : 'Guessing…'}
                </span>
              </li>
            ))}
        </ul>
      </RankUpPanel>

      <RankUpPrimaryButton onClick={revealRound}>Reveal my answer</RankUpPrimaryButton>
    </RankUpPageWrap>
  );
}
