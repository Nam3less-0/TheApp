import { useRankUp } from '../context';
import { labelForOption } from '../utils';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function GuesserRevealScreen() {
  const { local, room, beginSelfScore } = useRankUp();

  if (!room?.prompt) return null;

  const revealed = room.phase === 'reveal' && room.rankerOrder;

  if (!revealed) {
    return (
      <RankUpPageWrap>
        <header className="mb-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
            Guess locked in
          </p>
          <h1 className="mt-1 font-display text-[26px] font-extrabold text-text-hi">
            Waiting for reveal
          </h1>
          <p className="mt-2 font-body text-sm text-text-mid">{room.prompt}</p>
        </header>
        <RankUpPanel compact>
          <p className="text-center font-body text-sm text-text-mid">
            The ranker will reveal their order soon. You&apos;ll score yourself after.
          </p>
        </RankUpPanel>
      </RankUpPageWrap>
    );
  }

  return (
    <RankUpPageWrap>
      <header className="mb-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">Revealed</p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold text-text-hi">Ranker&apos;s order</h1>
        <p className="mt-2 font-body text-sm text-text-mid">{room.prompt}</p>
      </header>

      <RankUpPanel compact className="mb-6">
        <ol className="flex flex-col gap-2">
          {room.rankerOrder!.map((id, index) => (
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

      <RankUpPrimaryButton onClick={beginSelfScore}>Score myself</RankUpPrimaryButton>
      <p className="mt-3 text-center font-body text-[12px] text-text-low">
        Your score: {local.score}
      </p>
    </RankUpPageWrap>
  );
}
