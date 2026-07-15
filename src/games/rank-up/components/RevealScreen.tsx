import { useRankUp } from '../context';
import { labelForOption } from '../utils';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RevealScreen() {
  const { room, players, nextRound } = useRankUp();

  if (!room?.rankerOrder || !room.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);

  return (
    <RankUpPageWrap variant="display">
      <div className="text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-pewter">
          Revealed to all phones
        </p>
        <h1 className="mb-2 font-display text-2xl font-extrabold text-text-hi sm:text-3xl">
          {ranker?.name ?? 'Ranker'}&apos;s ranking
        </h1>
        <p className="mb-8 font-body text-sm text-text-mid">{room.prompt}</p>

        <RankUpPanel compact className="mb-8 text-left">
          <ol className="flex flex-col gap-2">
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
        </RankUpPanel>

        <p className="mb-6 font-body text-[13px] text-text-mid">
          Everyone scores themselves on their phone.
        </p>

        <RankUpPrimaryButton onClick={() => nextRound()}>Next round</RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
