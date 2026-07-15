import { useRankUp } from '../context';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
} from './Layout';

export default function LobbyScreen({ waitingForNextRound = false }: { waitingForNextRound?: boolean }) {
  const { local, room, players, isRanker, isHost, leaveGame, beginCompose, assignRanker } =
    useRankUp();

  if (!room) {
    return (
      <RankUpPageWrap>
        <p className="text-center font-body text-sm text-text-mid">Connecting to room…</p>
      </RankUpPageWrap>
    );
  }

  const ranker = players.find((player) => player.id === room.rankerPlayerId);

  return (
    <RankUpPageWrap>
      <header className="mb-6 text-center">
        {waitingForNextRound ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
              Round complete
            </p>
            <h1 className="mt-1 font-display text-[26px] font-extrabold text-text-hi">
              Score: {local.score}
            </h1>
            <p className="mt-2 font-body text-sm text-text-mid">
              Waiting for the ranker to start the next round…
            </p>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pewter">Room code</p>
            <p className="mt-1 font-mono text-4xl font-bold tracking-[0.25em] text-text-hi">{room.code}</p>
            <p className="mt-2 font-body text-sm text-text-mid">
              Share this code so friends can join on their phones.
            </p>
          </>
        )}
      </header>

      <RankUpPanel compact className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Players ({players.length})
        </p>
        <ul className="flex flex-col gap-2">
          {players.map((player) => {
            const isCurrentRanker = player.id === room.rankerPlayerId;
            return (
              <li
                key={player.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isCurrentRanker ? 'border-pewter/50 bg-surface' : 'border-line'
                }`}
              >
                <div>
                  <p className="font-body text-sm font-semibold text-text-hi">
                    {player.name}
                    {player.id === local.playerId ? ' (you)' : ''}
                  </p>
                  {isCurrentRanker && (
                    <p className="font-mono text-[10px] uppercase tracking-wider text-pewter">
                      Ranker
                    </p>
                  )}
                </div>
                <span className="font-mono text-sm text-pewter">{player.score}</span>
              </li>
            );
          })}
        </ul>
      </RankUpPanel>

      {isHost && !isRanker && (
        <RankUpPanel compact className="mb-6">
          <p className="mb-3 font-body text-[13px] text-text-mid">Set who ranks next:</p>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => (
              <RankUpSecondaryButton
                key={player.id}
                onClick={() => assignRanker(player.id)}
                className={player.id === room.rankerPlayerId ? 'border-pewter text-pewter' : ''}
              >
                {player.name}
              </RankUpSecondaryButton>
            ))}
          </div>
        </RankUpPanel>
      )}

      <div className="flex flex-col gap-3">
        {isRanker && !waitingForNextRound ? (
          <RankUpPrimaryButton onClick={beginCompose}>Start a round</RankUpPrimaryButton>
        ) : !waitingForNextRound ? (
          <RankUpPanel compact>
            <p className="text-center font-body text-sm text-text-mid">
              Waiting for <span className="font-semibold text-text-hi">{ranker?.name ?? 'ranker'}</span>{' '}
              to start the round…
            </p>
          </RankUpPanel>
        ) : null}

        <RankUpSecondaryButton onClick={leaveGame} className="w-full text-center">
          Leave room
        </RankUpSecondaryButton>
      </div>
    </RankUpPageWrap>
  );
}
