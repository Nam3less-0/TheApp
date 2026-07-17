import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps } from '../types';
import type { ForemansLedgerState } from './foremansLedger';
import { shuffle } from '../utils';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type Vote = 'yes' | 'no';
type Stage = 'gate' | 'vote' | 'revealed';

export default function ForemansLedgerPlay({ roundState, players, onResolve }: PlayProps<ForemansLedgerState>) {
  const [order] = useState(() => shuffle(players));
  const [turnIndex, setTurnIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('gate');
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  function castVote(vote: Vote) {
    const player = order[turnIndex];
    const next = { ...votes, [player.id]: vote };
    setVotes(next);
    if (turnIndex + 1 < order.length) {
      setTurnIndex((i) => i + 1);
      setStage('gate');
    } else {
      setStage('revealed');
    }
  }

  if (stage === 'gate') {
    return <PassGate player={order[turnIndex]} label="Pass to vote:" onReady={() => setStage('vote')} />;
  }

  if (stage === 'vote') {
    const player = order[turnIndex];
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {player.name}&rsquo;s secret ballot
        </p>
        <h2 className="mb-6 text-center font-display text-xl font-extrabold text-text-hi">
          {roundState.proposal}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => castVote('yes')}
            className="flex min-h-[90px] items-center justify-center rounded-2xl border border-line bg-surface font-display text-lg font-bold text-text-hi transition-colors hover:border-good"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => castVote('no')}
            className="flex min-h-[90px] items-center justify-center rounded-2xl border border-line bg-surface font-display text-lg font-bold text-text-hi transition-colors hover:border-[#E8A33D]"
          >
            No
          </button>
        </div>
      </MinigamePanel>
    );
  }

  // revealed
  const yesCount = order.filter((p) => votes[p.id] === 'yes').length;
  const noCount = order.length - yesCount;
  const buildersWon = yesCount === 0 || noCount === 0;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Ballot result
      </p>
      <div className="mb-5 flex items-center justify-center gap-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className="font-display text-4xl font-extrabold text-good">{yesCount}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">Yes</p>
        </motion.div>
        <span className="font-display text-2xl text-text-low">&ndash;</span>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className="font-display text-4xl font-extrabold" style={{ color: HAZARD }}>
            {noCount}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">No</p>
        </motion.div>
      </div>
      <p className="mb-5 text-center font-body text-sm text-text-mid">
        {buildersWon ? 'Unanimous \u2014 the crew is aligned.' : 'Split vote \u2014 doubt got in.'}
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: `Ballot landed ${yesCount}\u2013${noCount} \u2014 ${
              buildersWon ? 'unanimous' : 'split'
            }.`,
          })
        }
      >
        Continue
      </PrimaryButton>
    </MinigamePanel>
  );
}
