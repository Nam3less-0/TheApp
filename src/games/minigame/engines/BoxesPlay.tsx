import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps } from '../types';
import type { BoxesState } from './boxes';
import { shuffle } from '../utils';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type Side = 'left' | 'right';
type SubPhase = 'discuss' | 'gate' | 'vote' | 'revealed';

const DISCUSS_SECONDS = 45;

export default function BoxesPlay({ roundState, players, saboteurId, onResolve }: PlayProps<BoxesState>) {
  const [order] = useState(() => shuffle(players));
  const [subPhase, setSubPhase] = useState<SubPhase>('discuss');
  const [turnIndex, setTurnIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, Side>>({});
  const [secondsLeft, setSecondsLeft] = useState(DISCUSS_SECONDS);
  const [chosen, setChosen] = useState<Side | null>(null);

  useEffect(() => {
    if (subPhase !== 'discuss') return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [subPhase, secondsLeft]);

  function castVote(side: Side) {
    const player = order[turnIndex];
    const nextVotes = { ...votes, [player.id]: side };
    setVotes(nextVotes);

    if (turnIndex + 1 < order.length) {
      setTurnIndex((i) => i + 1);
      setSubPhase('gate');
      return;
    }

    const left = order.filter((p) => nextVotes[p.id] === 'left').length;
    const right = order.length - left;
    let winner: Side;
    if (left === right) {
      winner = nextVotes[saboteurId] ?? 'left';
    } else {
      winner = left > right ? 'left' : 'right';
    }
    setChosen(winner);
    setSubPhase('revealed');
  }

  if (subPhase === 'discuss') {
    return (
      <MinigamePanel>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6FA8DC]">Open discussion</p>
        <h2 className="mb-3 font-display text-xl font-extrabold text-text-hi">Which crate do we open?</h2>
        <p className="mb-5 font-body text-sm text-text-mid">
          Talk it out loud as a group. When you&rsquo;re ready — or time runs out — move to a secret vote.
        </p>
        <div className="mb-5 flex items-center justify-center">
          <span className="font-display text-4xl font-extrabold tabular-nums text-text-hi">
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
          </span>
        </div>
        <PrimaryButton onClick={() => setSubPhase('gate')}>Start the secret vote</PrimaryButton>
      </MinigamePanel>
    );
  }

  if (subPhase === 'gate') {
    return <PassGate player={order[turnIndex]} label="Pass to vote:" onReady={() => setSubPhase('vote')} />;
  }

  if (subPhase === 'vote') {
    const player = order[turnIndex];
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {player.name}&rsquo;s secret vote
        </p>
        <h2 className="mb-6 text-center font-display text-xl font-extrabold text-text-hi">
          Left or Right?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => castVote('left')}
            className="flex min-h-[100px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface font-display text-lg font-bold text-text-hi transition-colors hover:border-[#6FA8DC]"
          >
            <span className="text-3xl">◀</span>
            Left
          </button>
          <button
            type="button"
            onClick={() => castVote('right')}
            className="flex min-h-[100px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface font-display text-lg font-bold text-text-hi transition-colors hover:border-[#6FA8DC]"
          >
            <span className="text-3xl">▶</span>
            Right
          </button>
        </div>
      </MinigamePanel>
    );
  }

  // revealed
  const buildersWon = chosen === roundState.passSide;
  const leftCount = order.filter((p) => votes[p.id] === 'left').length;
  const rightCount = order.length - leftCount;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        {leftCount} voted Left · {rightCount} voted Right
      </p>
      <div className="mb-5 flex items-center justify-center gap-4">
        {(['left', 'right'] as Side[]).map((side) => {
          const isChosen = chosen === side;
          const isSafe = roundState.passSide === side;
          return (
            <motion.div
              key={side}
              initial={{ rotateX: 0 }}
              animate={isChosen ? { rotateX: [0, -15, 0] } : {}}
              transition={{ duration: 0.6 }}
              className="flex w-28 flex-col items-center gap-2 rounded-2xl border-2 px-3 py-6 text-center"
              style={{
                borderColor: isChosen ? (isSafe ? '#7ED9A4' : HAZARD) : 'rgba(220,224,232,0.16)',
                background: isChosen
                  ? isSafe
                    ? 'radial-gradient(circle at 50% 30%, rgba(126,217,164,0.18), #131417 70%)'
                    : `radial-gradient(circle at 50% 30%, ${HAZARD}22, #131417 70%)`
                  : 'transparent',
              }}
            >
              <span className="text-3xl">{isChosen ? (isSafe ? '✅' : '💥') : '📦'}</span>
              <span className="font-body text-xs font-bold uppercase tracking-wider text-text-mid">
                {side}
              </span>
              {isChosen && (
                <span
                  className="font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: isSafe ? '#7ED9A4' : HAZARD }}
                >
                  {isSafe ? 'Sound' : 'Failed'}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="mb-5 text-center font-body text-sm text-text-mid">
        The group opened the <span className="font-bold text-text-hi">{chosen}</span> crate — it was{' '}
        <span className="font-bold" style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}>
          {buildersWon ? 'sound' : 'rigged to fail'}
        </span>
        .
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: `Group opened the ${chosen} crate (${leftCount}–${rightCount}) — it was ${
              buildersWon ? 'safe' : 'the failing one'
            }.`,
          })
        }
      >
        Continue
      </PrimaryButton>
    </MinigamePanel>
  );
}
