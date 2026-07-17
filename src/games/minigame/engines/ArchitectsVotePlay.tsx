import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps, Player } from '../types';
import type { ArchitectsVoteState } from './architectsVote';
import { shuffle } from '../utils';
import PassGate from '../components/PassGate';
import PlayerAvatar from '../components/PlayerAvatar';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type Stage = 'propose' | 'gate' | 'vote' | 'vote-result' | 'crew-gate' | 'crew-decision' | 'revealed';

export default function ArchitectsVotePlay({ roundState, players, saboteurId, onResolve }: PlayProps<ArchitectsVoteState>) {
  const proposer = players.find((p) => p.id === roundState.proposerId)!;
  const [chosenIds, setChosenIds] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>('propose');
  const [voteOrder] = useState(() => shuffle(players));
  const [turnIndex, setTurnIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [taskSucceeds, setTaskSucceeds] = useState<boolean | null>(null);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  function toggleChoice(id: string) {
    setChosenIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function castVote(approve: boolean) {
    const voter = voteOrder[turnIndex];
    const next = { ...votes, [voter.id]: approve };
    setVotes(next);
    if (turnIndex + 1 < voteOrder.length) {
      setTurnIndex((i) => i + 1);
      setStage('gate');
    } else {
      setStage('vote-result');
    }
  }

  function afterVoteResult() {
    const approveCount = voteOrder.filter((p) => votes[p.id]).length;
    const approved = approveCount > voteOrder.length / 2;
    if (!approved) {
      setStage('revealed');
      return;
    }
    if (chosenIds.includes(saboteurId)) {
      setStage('crew-gate');
    } else {
      setTaskSucceeds(true);
      setStage('revealed');
    }
  }

  if (stage === 'propose') {
    return (
      <MinigamePanel>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#C9A44A]">
          {proposer.name} is proposing
        </p>
        <h2 className="mb-4 font-display text-xl font-extrabold text-text-hi">Pick 2 for the crew</h2>
        <div className="mb-6 grid grid-cols-2 gap-2.5">
          {players.map((p) => {
            const selected = chosenIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleChoice(p.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-colors ${
                  selected ? 'border-[#C9A44A]' : 'border-line hover:border-line-bright'
                }`}
                style={selected ? { background: 'rgba(201,164,74,0.12)' } : undefined}
              >
                <PlayerAvatar name={p.name} />
                <span className="font-body text-sm font-bold text-text-hi">{p.name}</span>
              </button>
            );
          })}
        </div>
        <PrimaryButton disabled={chosenIds.length !== 2} onClick={() => setStage('gate')}>
          Put it to a vote
        </PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'gate') {
    return <PassGate player={voteOrder[turnIndex]} label="Pass to vote:" onReady={() => setStage('vote')} />;
  }

  if (stage === 'vote') {
    const crewNames = chosenIds.map((id) => playerById.get(id)?.name).join(' & ');
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {voteOrder[turnIndex].name}&rsquo;s secret vote
        </p>
        <h2 className="mb-6 text-center font-display text-lg font-extrabold text-text-hi">
          Approve {crewNames}?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => castVote(true)}
            className="flex min-h-[90px] items-center justify-center rounded-2xl border border-line bg-surface font-display text-base font-bold text-text-hi transition-colors hover:border-good"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => castVote(false)}
            className="flex min-h-[90px] items-center justify-center rounded-2xl border border-line bg-surface font-display text-base font-bold text-text-hi transition-colors hover:border-[#E8A33D]"
          >
            Reject
          </button>
        </div>
      </MinigamePanel>
    );
  }

  if (stage === 'vote-result') {
    const approveCount = voteOrder.filter((p) => votes[p.id]).length;
    const approved = approveCount > voteOrder.length / 2;
    return (
      <MinigamePanel>
        <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Vote result
        </p>
        <h2
          className="mb-6 text-center font-display text-xl font-extrabold"
          style={{ color: approved ? '#7ED9A4' : HAZARD }}
        >
          {approved ? 'Approved' : 'Rejected'} ({approveCount}&ndash;{voteOrder.length - approveCount})
        </h2>
        <PrimaryButton onClick={afterVoteResult}>Continue</PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'crew-gate') {
    return (
      <PassGate
        player={playerById.get(saboteurId)!}
        label="Pass to the crew member:"
        onReady={() => setStage('crew-decision')}
      />
    );
  }

  if (stage === 'crew-decision') {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Your call, privately
        </p>
        <h2 className="mb-6 text-center font-display text-xl font-extrabold text-text-hi">
          Complete the task, or sabotage it?
        </h2>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              setTaskSucceeds(true);
              setStage('revealed');
            }}
            className="rounded-xl border border-line bg-surface px-4 py-3.5 font-body text-sm font-bold text-text-hi transition-colors hover:border-good"
          >
            Complete it honestly
          </button>
          <button
            type="button"
            onClick={() => {
              setTaskSucceeds(false);
              setStage('revealed');
            }}
            className="rounded-xl border px-4 py-3.5 font-body text-sm font-bold transition-colors"
            style={{ borderColor: `${HAZARD}66`, background: `${HAZARD}14`, color: HAZARD }}
          >
            Sabotage it
          </button>
        </div>
      </MinigamePanel>
    );
  }

  // revealed
  const approveCount = voteOrder.filter((p) => votes[p.id]).length;
  const approved = approveCount > voteOrder.length / 2;
  const crewNames = chosenIds.map((id) => playerById.get(id)?.name).join(' & ');

  let buildersWon: boolean;
  let summary: string;
  if (!approved) {
    buildersWon = false;
    summary = `Crew proposal (${crewNames}) was rejected ${voteOrder.length - approveCount}\u2013${approveCount} \u2014 the project stalled.`;
  } else if (taskSucceeds === true && !chosenIds.includes(saboteurId)) {
    buildersWon = true;
    summary = `${crewNames} went on site \u2014 clean crew, task completed.`;
  } else {
    buildersWon = !!taskSucceeds;
    summary = `${crewNames} went on site \u2014 the task was ${taskSucceeds ? 'completed' : 'quietly sabotaged'}.`;
  }

  return (
    <MinigamePanel>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Outcome
        </p>
        <h2
          className="mb-4 text-center font-display text-xl font-extrabold"
          style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}
        >
          {buildersWon ? 'Task completed' : !approved ? 'Proposal rejected' : 'Task sabotaged'}
        </h2>
        <p className="mb-6 text-center font-body text-sm text-text-mid">{summary}</p>
        <PrimaryButton onClick={() => onResolve({ buildersWon, summary })}>Continue</PrimaryButton>
      </motion.div>
    </MinigamePanel>
  );
}
