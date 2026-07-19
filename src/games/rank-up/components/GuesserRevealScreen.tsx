import { useRankUp } from '../context';
import { roundPointsLabel } from '../utils';
import { GuesserScreenHeader } from './GuesserBadge';
import GuesserProgressRow from './GuesserProgressRow';
import OrderList from './OrderList';
import RankUpPanel, { RankUpPageWrap } from './Layout';

const POINTS_BADGE: Record<0 | 1 | 3, string> = {
  3: '+3',
  1: '+1',
  0: '+0',
};

export default function GuesserRevealScreen() {
  const { local, room, players } = useRankUp();
  const myPlayer = players.find((player) => player.id === local.playerId);
  const myGuessOrder =
    local.lastGuessOrder.length > 0
      ? local.lastGuessOrder
      : (myPlayer?.guessOrder ?? []);

  if (!room?.prompt) return null;

  const revealed = room.phase === 'reveal' && room.rankerOrder;
  const roundPoints = myPlayer?.lastRoundPoints;
  const missedGuess = revealed && myGuessOrder.length === 0;

  if (!revealed) {
    return (
      <RankUpPageWrap>
        <GuesserScreenHeader
          eyebrow="Guess locked in"
          title="Waiting for reveal"
          subtitle={room.prompt}
        />
        <GuesserProgressRow className="mb-6" variant="waiting" showLabel={false} />
        <RankUpPanel compact>
          <p className="text-center font-body text-sm text-text-mid">
            The ranker will reveal their order soon. Your score will be calculated automatically.
          </p>
        </RankUpPanel>
      </RankUpPageWrap>
    );
  }

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow="Round scored"
        title={
          missedGuess
            ? 'No guess submitted'
            : roundPoints != null
              ? roundPointsLabel(roundPoints)
              : 'Results'
        }
        subtitle={room.prompt}
      />

      {missedGuess ? (
        <RankUpPanel compact className="mb-6">
          <p className="text-center font-body text-sm text-text-mid">
            You didn&apos;t lock in a guess this round — no points earned.
          </p>
        </RankUpPanel>
      ) : roundPoints != null ? (
        <RankUpPanel compact className="mb-6 border-pewter/30 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
            You earned
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold text-text-hi">
            {POINTS_BADGE[roundPoints]}
          </p>
          <p className="mt-2 font-body text-sm text-text-mid">
            Total score: {local.score}
          </p>
        </RankUpPanel>
      ) : (
        <RankUpPanel compact className="mb-6">
          <p className="text-center font-body text-sm text-text-mid">Calculating your score…</p>
        </RankUpPanel>
      )}

      {!missedGuess ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RankUpPanel compact>
            <p className="mb-3 font-body text-sm font-bold text-text-hi">Your guess</p>
            <OrderList
              order={myGuessOrder}
              options={room.options}
              variant="compact"
              showRail
              bestLabel="Best"
              worstLabel="Worst"
            />
          </RankUpPanel>

          <RankUpPanel compact className="border-pewter/30">
            <p className="mb-3 font-body text-sm font-bold text-text-hi">Ranker&apos;s order</p>
            <OrderList
              order={room.rankerOrder!}
              options={room.options}
              variant="compact"
              showRail
              bestLabel="Best"
              worstLabel="Worst"
            />
          </RankUpPanel>
        </div>
      ) : (
        <RankUpPanel compact className="mb-6 border-pewter/30">
          <p className="mb-3 font-body text-sm font-bold text-text-hi">Ranker&apos;s order</p>
          <OrderList
            order={room.rankerOrder!}
            options={room.options}
            variant="compact"
            showRail
            bestLabel="Best"
            worstLabel="Worst"
          />
        </RankUpPanel>
      )}

      <p className="text-center font-body text-[12px] text-text-low">
        Waiting for the ranker to start the next round…
      </p>
    </RankUpPageWrap>
  );
}
