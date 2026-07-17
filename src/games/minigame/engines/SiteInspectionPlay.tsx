import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps } from '../types';
import type { SiteInspectionState } from './siteInspection';
import { shuffle } from '../utils';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type Call = 'approve' | 'reject';
type Stage = 'discuss' | 'gate' | 'vote' | 'order-result';

interface Verdict {
  orderId: number;
  approveCount: number;
  rejectCount: number;
  call: Call;
  correct: boolean;
}

export default function SiteInspectionPlay({ roundState, players, saboteurId, onResolve }: PlayProps<SiteInspectionState>) {
  const [order] = useState(() => shuffle(players));
  const [orderIndex, setOrderIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('discuss');
  const [turnIndex, setTurnIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, Call>>({});
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);

  const currentOrder = roundState.orders[orderIndex];

  function castVote(voteCall: Call) {
    const player = order[turnIndex];
    const nextVotes = { ...votes, [player.id]: voteCall };
    setVotes(nextVotes);

    if (turnIndex + 1 < order.length) {
      setTurnIndex((i) => i + 1);
      setStage('gate');
      return;
    }

    const approveCount = order.filter((p) => nextVotes[p.id] === 'approve').length;
    const rejectCount = order.length - approveCount;
    let call: Call;
    if (approveCount === rejectCount) {
      call = nextVotes[saboteurId] ?? 'approve';
    } else {
      call = approveCount > rejectCount ? 'approve' : 'reject';
    }
    const correct =
      (call === 'approve' && currentOrder.trueStatus === 'sound') ||
      (call === 'reject' && currentOrder.trueStatus === 'compromised');

    setVerdicts((v) => [...v, { orderId: currentOrder.id, approveCount, rejectCount, call, correct }]);
    setVotes({});
    setTurnIndex(0);
    setStage('order-result');
  }

  function nextOrder() {
    if (orderIndex + 1 < roundState.orders.length) {
      setOrderIndex((i) => i + 1);
      setStage('discuss');
    } else {
      const correctCount = verdicts.filter((v) => v.correct).length;
      const buildersWon = correctCount >= 2;
      onResolve({
        buildersWon,
        summary: `Correctly called ${correctCount} of ${roundState.orders.length} orders.`,
      });
    }
  }

  if (stage === 'discuss') {
    return (
      <MinigamePanel>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6FA8DC]">
          Order {orderIndex + 1} of {roundState.orders.length}
        </p>
        <h2 className="mb-4 font-display text-xl font-extrabold text-text-hi">{currentOrder.label}</h2>
        <p className="mb-6 font-body text-sm text-text-mid">
          Discuss it out loud, then move to a secret vote: Approve or Reject.
        </p>
        <PrimaryButton onClick={() => setStage('gate')}>Start the secret vote</PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'gate') {
    return <PassGate player={order[turnIndex]} label="Pass to vote:" onReady={() => setStage('vote')} />;
  }

  if (stage === 'vote') {
    const player = order[turnIndex];
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {player.name}&rsquo;s secret call on &ldquo;{currentOrder.label}&rdquo;
        </p>
        <h2 className="mb-6 text-center font-display text-xl font-extrabold text-text-hi">Approve or Reject?</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => castVote('approve')}
            className="flex min-h-[90px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface font-display text-base font-bold text-text-hi transition-colors hover:border-good"
          >
            <span className="text-2xl">&#10003;</span>
            Approve
          </button>
          <button
            type="button"
            onClick={() => castVote('reject')}
            className="flex min-h-[90px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface font-display text-base font-bold text-text-hi transition-colors hover:border-[#E8A33D]"
          >
            <span className="text-2xl">&#10007;</span>
            Reject
          </button>
        </div>
      </MinigamePanel>
    );
  }

  // order-result
  const latest = verdicts[verdicts.length - 1];
  return (
    <MinigamePanel>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentOrder.label}
        </p>
        <h2 className="mb-3 text-center font-display text-lg font-extrabold text-text-hi">
          Group called it: {latest.call === 'approve' ? 'Approve' : 'Reject'} ({latest.approveCount}&ndash;
          {latest.rejectCount})
        </h2>
        <p
          className="mb-6 text-center font-body text-sm font-bold"
          style={{ color: latest.correct ? '#7ED9A4' : HAZARD }}
        >
          It was actually {currentOrder.trueStatus === 'sound' ? 'sound' : 'compromised'} &mdash;{' '}
          {latest.correct ? 'correct call.' : 'wrong call.'}
        </p>
        <PrimaryButton onClick={nextOrder}>
          {orderIndex + 1 < roundState.orders.length ? 'Next order' : 'See final tally'}
        </PrimaryButton>
      </motion.div>
    </MinigamePanel>
  );
}
