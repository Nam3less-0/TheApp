import { useRankUp } from '../context';
import RoundHistoryDrawer from './RoundHistoryDrawer';
import RoomCodeDisplay from './RoomCodeDisplay';
import AbandonRoundButton from './AbandonRoundButton';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
} from './Layout';
import { CrownIcon } from './RankUpIcons';

export default function LobbyScreen() {
  const {
    local,
    room,
    players,
    isRanker,
    isHost,
    leaveGame,
    beginCompose,
    startNewRound,
    skipCurrentTurn,
    awaitingRoundStart,
  } = useRankUp();

  if (!room) {
    return null;
  }

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const rankerMissingFromRoom = Boolean(
    room.rankerPlayerId && !players.some((player) => player.id === room.rankerPlayerId),
  );

  return (
    <RankUpPageWrap>
      <header className="mb-6">
        <RoomCodeDisplay code={room.code} />
      </header>

      <RoundHistoryDrawer />

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
                  isCurrentRanker
                    ? 'border-pewter/50 bg-surface shadow-[0_0_16px_rgba(155,147,168,0.12)]'
                    : 'border-line'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-deep/60 font-mono text-xs font-bold text-text-mid">
                    {isCurrentRanker ? (
                      <CrownIcon className="h-3.5 w-3.5 text-pewter" />
                    ) : (
                      player.name.slice(0, 1).toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-body text-sm font-semibold text-text-hi">
                      {player.name}
                      {player.id === local.playerId ? ' (you)' : ''}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">
                      {isCurrentRanker ? 'Ranker' : 'Guesser'}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-sm text-pewter">{player.score}</span>
              </li>
            );
          })}
        </ul>
      </RankUpPanel>

      <div className="flex flex-col gap-3">
        {awaitingRoundStart ? (
          isHost ? (
            <RankUpPrimaryButton onClick={() => startNewRound()}>Start Round 1</RankUpPrimaryButton>
          ) : (
            <RankUpPanel compact>
              <p className="text-center font-body text-sm text-text-mid">
                Waiting for the host to start Round 1…
              </p>
            </RankUpPanel>
          )
        ) : isRanker ? (
          <RankUpPrimaryButton onClick={beginCompose}>Start your turn</RankUpPrimaryButton>
        ) : (
          <RankUpPanel compact>
            <p className="text-center font-body text-sm text-text-mid">
              Waiting for{' '}
              <span className="inline-flex items-center gap-1 font-semibold text-text-hi">
                <CrownIcon className="h-3.5 w-3.5 text-pewter" />
                {ranker?.name ?? 'ranker'}
              </span>{' '}
              to start their turn…
            </p>
          </RankUpPanel>
        )}

        {isHost && rankerMissingFromRoom ? (
          <RankUpSecondaryButton onClick={() => skipCurrentTurn()} className="w-full text-center">
            Skip {ranker?.name ?? 'ranker'}&apos;s turn
          </RankUpSecondaryButton>
        ) : null}

        <AbandonRoundButton />

        <RankUpSecondaryButton onClick={leaveGame} className="w-full text-center">
          Leave room
        </RankUpSecondaryButton>
      </div>
    </RankUpPageWrap>
  );
}
