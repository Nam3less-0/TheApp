import { LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import { useRankUp } from '../context';
import { useSessionUI } from '../sessionUi';
import { labelForOption } from '../utils';
import { CrownIcon, EyeIcon } from './RankUpIcons';
import RoundHistoryDrawer from './RoundHistoryDrawer';
import RoomCodeDisplay from './RoomCodeDisplay';
import AbandonRoundButton from './AbandonRoundButton';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
} from './Layout';

export default function LobbyScreen({ waitingForNextRound = false }: { waitingForNextRound?: boolean }) {
  const { local, room, players, isRanker, isHost, leaveGame, beginCompose, assignRanker } =
    useRankUp();
  const { roundHistory } = useSessionUI();
  const [crownTargetId, setCrownTargetId] = useState<string | null>(null);
  const [isPassingCrown, setIsPassingCrown] = useState(false);

  if (!room) {
    return null;
  }

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const lastRound = roundHistory[roundHistory.length - 1];

  async function handlePassCrown(playerId: string) {
    if (!isHost || isPassingCrown || playerId === room!.rankerPlayerId) return;

    setIsPassingCrown(true);
    setCrownTargetId(playerId);

    await new Promise((resolve) => window.setTimeout(resolve, 500));
    await assignRanker(playerId);

    setCrownTargetId(null);
    setIsPassingCrown(false);
  }

  const crownHolderId = crownTargetId ?? room.rankerPlayerId;

  return (
    <RankUpPageWrap>
      <header className="mb-6">
        {waitingForNextRound ? (
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
              Round complete
            </p>
            <h1 className="mt-1 font-display text-[26px] font-extrabold text-text-hi">
              Score: {local.score}
            </h1>
            {lastRound ? (
              <RankUpPanel compact className="mt-4 text-left">
                <p className="font-body text-[13px] font-semibold text-text-hi">{lastRound.prompt}</p>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-pewter">
                  <CrownIcon className="h-3 w-3" />
                  Ranked by {lastRound.rankerName}
                </p>
                <ol className="mt-2 flex flex-col gap-0.5">
                  {lastRound.rankerOrder.slice(0, 4).map((id, index) => (
                    <li key={id} className="font-body text-[12px] text-text-mid">
                      <span className="font-mono text-text-low">{index + 1}.</span>{' '}
                      {labelForOption(lastRound.options, id)}
                    </li>
                  ))}
                </ol>
              </RankUpPanel>
            ) : (
              <p className="mt-2 font-body text-sm text-text-mid">
                Waiting for the ranker to start the next round…
              </p>
            )}
          </div>
        ) : (
          <RoomCodeDisplay code={room.code} />
        )}
      </header>

      <RoundHistoryDrawer />

      <RankUpPanel compact className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Players ({players.length})
        </p>
        <LayoutGroup id="lobby-players">
          <ul className="flex flex-col gap-2">
            {players.map((player) => {
              const isCurrentRanker = player.id === room.rankerPlayerId;
              const isGuesser = !isCurrentRanker;
              const showCrown = player.id === crownHolderId;
              const canReceiveCrown = isHost && !isRanker && isGuesser && !isPassingCrown;

              return (
                <li key={player.id}>
                  <button
                    type="button"
                    disabled={!canReceiveCrown}
                    onClick={() => canReceiveCrown && handlePassCrown(player.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                      isCurrentRanker
                        ? 'border-pewter/50 bg-surface shadow-[0_0_16px_rgba(155,147,168,0.12)]'
                        : 'border-line'
                    } ${canReceiveCrown ? 'cursor-pointer hover:border-pewter/40' : 'cursor-default'}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-deep/60 font-mono text-xs font-bold text-text-mid">
                        {showCrown ? (
                          <motion.span
                            layoutId="pass-crown"
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-pewter/20 text-pewter"
                            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                          >
                            <CrownIcon className="h-3 w-3" />
                          </motion.span>
                        ) : isGuesser ? (
                          <EyeIcon className="h-3.5 w-3.5 text-text-low" />
                        ) : null}
                        {player.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-body text-sm font-semibold text-text-hi">
                          {player.name}
                          {player.id === local.playerId ? ' (you)' : ''}
                        </p>
                        {isCurrentRanker ? (
                          <p className="font-mono text-[10px] uppercase tracking-wider text-pewter">
                            Ranker
                          </p>
                        ) : (
                          <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">
                            Guesser
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-pewter">{player.score}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </RankUpPanel>

      {isHost && !isRanker && !waitingForNextRound ? (
        <RankUpPanel compact className="mb-6">
          <p className="mb-1 font-body text-[13px] font-semibold text-text-hi">Pass the crown</p>
          <p className="mb-3 font-body text-[12px] text-text-mid">
            Tap a player to choose who ranks next.
          </p>
        </RankUpPanel>
      ) : null}

      <div className="flex flex-col gap-3">
        {isRanker && !waitingForNextRound ? (
          <RankUpPrimaryButton onClick={beginCompose}>Start a round</RankUpPrimaryButton>
        ) : !waitingForNextRound ? (
          <RankUpPanel compact>
            <p className="text-center font-body text-sm text-text-mid">
              Waiting for{' '}
              <span className="inline-flex items-center gap-1 font-semibold text-text-hi">
                <CrownIcon className="h-3.5 w-3.5 text-pewter" />
                {ranker?.name ?? 'ranker'}
              </span>{' '}
              to start the round…
            </p>
          </RankUpPanel>
        ) : null}

        <AbandonRoundButton />

        <RankUpSecondaryButton onClick={leaveGame} className="w-full text-center">
          Leave room
        </RankUpSecondaryButton>
      </div>
    </RankUpPageWrap>
  );
}
