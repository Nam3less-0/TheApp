import { useRankUp } from '../context';
import { labelForOption, perfectPoints } from '../utils';
import AbandonRoundButton from './AbandonRoundButton';
import BigScreenRevealCard from './BigScreenRevealCard';
import CommandCenterFrame from './CommandCenterFrame';
import ScoreResultChip from './ScoreResultChip';
import { TeamsRevealSummaryPanel } from './TeamsRevealSummary';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RevealScreen() {
  const {
    room,
    players,
    advanceTurn,
    isLastTurnOfRound,
    hostDeviceConnected,
    isTeamsGame,
    canAdvanceTurn,
    sessionHostActive,
  } = useRankUp();

  if (!room?.rankerOrder || !room.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);
  const itemCount = room.options.length;

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

        {hostDeviceConnected ? (
          <BigScreenRevealCard
            pointsLabel="Scores on the big screen"
            className="mb-6"
          />
        ) : isTeamsGame ? (
          <TeamsRevealSummaryPanel />
        ) : guessers.length > 0 ? (
          <RankUpPanel compact className="mb-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Round scores
            </p>
            <ul className="flex flex-col gap-3">
              {guessers.map((player) => {
                const guessOrder = player.guessOrder ?? [];
                const points = player.lastRoundPoints;

                return (
                  <li
                    key={player.id}
                    className="flex flex-col gap-3 rounded-lg border border-line px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-body text-sm font-semibold text-text-hi">
                      {player.name}
                    </span>
                    {points != null && guessOrder.length > 0 ? (
                      <ScoreResultChip
                        points={points}
                        guessOrder={guessOrder}
                        rankerOrder={room.rankerOrder!}
                      />
                    ) : (
                      <span className="font-mono text-sm text-text-low">
                        {player.guessSubmitted ? 'Scored' : 'No guess'}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 font-mono text-[10px] text-text-low">
              Perfect pays +{perfectPoints(itemCount)} this turn
            </p>
          </RankUpPanel>
        ) : null}

        {canAdvanceTurn ? (
          <>
            <RankUpPrimaryButton onClick={() => advanceTurn()}>
              {isLastTurnOfRound ? 'See round recap' : 'Next turn'}
            </RankUpPrimaryButton>
            <AbandonRoundButton className="mt-3" />
          </>
        ) : (
          <RankUpPanel compact>
            <p className="text-center font-body text-sm text-text-mid">
              {sessionHostActive
                ? 'Waiting for the gameroom host to continue…'
                : 'Waiting for the ranker to continue…'}
            </p>
          </RankUpPanel>
        )}
      </CommandCenterFrame>
    </RankUpPageWrap>
  );
}
