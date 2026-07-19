import { useEffect } from 'react';
import { useRankUp } from '../context';
import { CrownIcon } from './RankUpIcons';

interface TurnTransitionBeatProps {
  onComplete: () => void;
}

export default function TurnTransitionBeat({ onComplete }: TurnTransitionBeatProps) {
  const { room, players } = useRankUp();
  const ranker = players.find((player) => player.id === room?.rankerPlayerId);

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[560px] flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D8B36A] bg-[#D8B36A]/10 rank-up-turn-pulse"
        aria-hidden="true"
      >
        <CrownIcon className="h-7 w-7 text-[#D8B36A]" />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
        Next up
      </p>
      <h1 className="mt-2 font-display text-[28px] font-extrabold text-text-hi">
        It&apos;s {ranker?.name ?? 'their'} turn!
      </h1>
      <p className="mt-2 font-body text-sm text-text-mid">
        {ranker?.name ?? 'The ranker'} is drawing a question…
      </p>
    </div>
  );
}
