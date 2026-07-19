import { useRankUp } from '../context';
import { labelForOption, roundPointsLabel } from '../utils';
import AbandonRoundButton from './AbandonRoundButton';
import CommandCenterFrame from './CommandCenterFrame';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RevealScreen() {
  const { room, players, nextRound } = useRankUp();

  if (!room?.rankerOrder || !room.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);

  return (
    <RankUpPageWrap variant="display">
      <CommandCenterFrame
        eyebrow="Command center — revealed"
        title={`${ranker?.name ?? 'Ranker'}'s ranking`}
        subtitle={room.prompt}
      >
        <ol className="mb-6 flex flex-col gap-2 text-left">
          {room.rankerOrder.map((id, index) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-xl border border-pewter/40 bg-surface px-4 py-3"
            >
              <span className="font-mono text-sm font-bold text-pewter">{index + 1}</span>
              <span className="font-body text-sm font-semibold text-text-hi">
                {labelForOption(room.options, id)}
              </span>
            </li>
          ))}
        </ol>

        {guessers.length > 0 ? (
          <RankUpPanel compact className="mb-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Round scores
            </p>
            <ul className="flex flex-col gap-2">
              {guessers.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-2"
                >
                  <span className="font-body text-sm font-semibold text-text-hi">
                    {player.name}
                  </span>
                  <span className="font-mono text-sm text-pewter">
                    {player.lastRoundPoints != null
                      ? roundPointsLabel(player.lastRoundPoints)
                      : player.guessSubmitted
                        ? 'Scored'
                        : 'No guess'}
                  </span>
                </li>
              ))}
            </ul>
          </RankUpPanel>
        ) : null}

        <p className="mb-6 font-body text-[13px] text-text-mid">
          Scores have been calculated automatically.
        </p>

        <RankUpPrimaryButton onClick={() => nextRound()}>Next round</RankUpPrimaryButton>
        <AbandonRoundButton className="mt-3" />
      </CommandCenterFrame>
    </RankUpPageWrap>
  );
}