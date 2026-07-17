import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps } from '../types';
import type { SupplyProject, SupplyRunState } from './supplyRun';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type SubPhase = 'pledge' | 'gate' | 'allocate' | 'revealed';

export default function SupplyRunPlay({ roundState, players, onResolve }: PlayProps<SupplyRunState>) {
  const { projects, fundingNeeded, tokensPerPlayer } = roundState;
  const [subPhase, setSubPhase] = useState<SubPhase>('pledge');
  const [pledges, setPledges] = useState<Record<string, SupplyProject | null>>(() =>
    Object.fromEntries(players.map((p) => [p.id, null])),
  );
  const [turnIndex, setTurnIndex] = useState(0);
  const [allocations, setAllocations] = useState<Record<string, Record<SupplyProject, number>>>({});
  const [draft, setDraft] = useState<Record<SupplyProject, number>>(() =>
    Object.fromEntries(projects.map((p) => [p, 0])) as Record<SupplyProject, number>,
  );

  const currentPlayer = players[turnIndex];
  const draftTotal = projects.reduce((sum, p) => sum + draft[p], 0);

  function adjust(project: SupplyProject, delta: number) {
    setDraft((prev) => {
      const nextVal = prev[project] + delta;
      if (nextVal < 0) return prev;
      const total = projects.reduce((s, p) => s + (p === project ? nextVal : prev[p]), 0);
      if (total > tokensPerPlayer) return prev;
      return { ...prev, [project]: nextVal };
    });
  }

  function lockAllocation() {
    const next = { ...allocations, [currentPlayer.id]: draft };
    setAllocations(next);
    setDraft(Object.fromEntries(projects.map((p) => [p, 0])) as Record<SupplyProject, number>);
    if (turnIndex + 1 < players.length) {
      setTurnIndex((i) => i + 1);
      setSubPhase('gate');
    } else {
      setSubPhase('revealed');
    }
  }

  if (subPhase === 'pledge') {
    const allPledged = players.every((p) => pledges[p.id]);
    return (
      <MinigamePanel>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#C9A44A]">Out loud, together</p>
        <h2 className="mb-4 font-display text-xl font-extrabold text-text-hi">Where will you send your tokens?</h2>
        <p className="mb-5 font-body text-sm text-text-mid">
          Say it out loud, one at a time. Tap the project each person pledges to.
        </p>
        <ul className="mb-6 flex flex-col gap-2.5">
          {players.map((p) => (
            <li key={p.id} className="rounded-xl border border-line bg-surface px-3.5 py-3">
              <p className="mb-2 font-body text-sm font-bold text-text-hi">{p.name}</p>
              <div className="grid grid-cols-3 gap-2">
                {projects.map((proj) => (
                  <button
                    key={proj}
                    type="button"
                    onClick={() => setPledges((prev) => ({ ...prev, [p.id]: proj }))}
                    className={`rounded-lg border px-2 py-2 font-body text-xs font-bold transition-colors ${
                      pledges[p.id] === proj
                        ? 'border-[#C9A44A] text-[#EAC870]'
                        : 'border-line text-text-mid hover:border-line-bright'
                    }`}
                  >
                    {proj}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <PrimaryButton disabled={!allPledged} onClick={() => setSubPhase('gate')}>
          Lock in pledges — start allocating
        </PrimaryButton>
      </MinigamePanel>
    );
  }

  if (subPhase === 'gate') {
    return <PassGate player={currentPlayer} label="Pass to allocate:" onReady={() => setSubPhase('allocate')} />;
  }

  if (subPhase === 'allocate') {
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentPlayer.name}&rsquo;s private allocation
        </p>
        <h2 className="mb-1 text-center font-display text-xl font-extrabold text-text-hi">
          Split your {tokensPerPlayer} tokens
        </h2>
        <p className="mb-5 text-center font-body text-xs text-text-mid">
          You pledged <span className="font-bold text-text-hi">{pledges[currentPlayer.id]}</span> — but this is
          your call now.
        </p>
        <div className="mb-5 flex flex-col gap-2.5">
          {projects.map((proj) => (
            <div
              key={proj}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-3"
            >
              <span className="font-body text-sm font-bold text-text-hi">{proj}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjust(proj, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-text-mid"
                >
                  −
                </button>
                <span className="w-4 text-center font-display text-base font-bold text-text-hi">{draft[proj]}</span>
                <button
                  type="button"
                  onClick={() => adjust(proj, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-text-mid"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mb-4 text-center font-mono text-[11px] text-text-low">
          {draftTotal} / {tokensPerPlayer} allocated
        </p>
        <PrimaryButton disabled={draftTotal !== tokensPerPlayer} onClick={lockAllocation}>
          Lock in allocation
        </PrimaryButton>
      </MinigamePanel>
    );
  }

  // revealed
  const totals: Record<SupplyProject, number> = Object.fromEntries(
    projects.map((proj) => [proj, players.reduce((sum, p) => sum + (allocations[p.id]?.[proj] ?? 0), 0)]),
  ) as Record<SupplyProject, number>;
  const starved = projects.filter((p) => totals[p] < fundingNeeded);
  const buildersWon = starved.length === 0;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Funding results
      </p>
      <div className="mb-5 flex flex-col gap-2.5">
        {projects.map((proj, i) => {
          const funded = totals[proj] >= fundingNeeded;
          return (
            <motion.div
              key={proj}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center justify-between rounded-xl border px-3.5 py-3"
              style={{
                borderColor: funded ? 'rgba(126,217,164,0.4)' : `${HAZARD}66`,
                background: funded ? 'rgba(126,217,164,0.08)' : `${HAZARD}14`,
              }}
            >
              <span className="font-body text-sm font-bold text-text-hi">{proj}</span>
              <span
                className="font-display text-lg font-extrabold tabular-nums"
                style={{ color: funded ? '#7ED9A4' : HAZARD }}
              >
                {totals[proj]} / {fundingNeeded}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p className="mb-5 text-center font-body text-sm text-text-mid">
        {buildersWon ? (
          'All three projects made it.'
        ) : (
          <>
            <span className="font-bold" style={{ color: HAZARD }}>
              {starved.join(', ')}
            </span>{' '}
            fell short.
          </>
        )}
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: buildersWon
              ? 'All three projects were fully funded.'
              : `${starved.join(', ')} fell short of funding.`,
          })
        }
      >
        Continue
      </PrimaryButton>
    </MinigamePanel>
  );
}
