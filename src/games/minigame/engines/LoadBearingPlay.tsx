import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps, Player } from '../types';
import type { LoadBearingState } from './loadBearing';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type SubPhase = 'gate' | 'turn' | 'revealed';

export default function LoadBearingPlay({
  roundState,
  players,
  saboteurId,
  onResolve,
}: PlayProps<LoadBearingState>) {
  const [subPhase, setSubPhase] = useState<SubPhase>('gate');
  const [turnIndex, setTurnIndex] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const currentTurn = roundState.turns[turnIndex];
  const currentPlayer = currentTurn ? playerById.get(currentTurn.playerId) : undefined;

  function place(value: number) {
    const next = [...placed, value];
    setPlaced(next);
    if (turnIndex + 1 < roundState.turns.length) {
      setTurnIndex((i) => i + 1);
      setSubPhase('gate');
    } else {
      setSubPhase('revealed');
    }
  }

  if (subPhase === 'gate' && currentPlayer) {
    return <PassGate player={currentPlayer} label="Pass to place a beam:" onReady={() => setSubPhase('turn')} />;
  }

  if (subPhase === 'turn' && currentPlayer && currentTurn) {
    const isSaboteur = currentTurn.playerId === saboteurId;
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentPlayer.name} — beam {turnIndex + 1} of {roundState.turns.length}
        </p>
        <h2 className="mb-6 text-center font-display text-xl font-extrabold text-text-hi">
          Your load rolled: {currentTurn.naturalRoll}
        </h2>
        {isSaboteur ? (
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => place(currentTurn.naturalRoll)}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-left transition-colors hover:border-[#C99A7A]"
            >
              <span className="font-body text-sm font-bold text-text-hi">Place true load</span>
              <span className="font-display text-lg font-extrabold text-text-hi">{currentTurn.naturalRoll}</span>
            </button>
            <button
              type="button"
              onClick={() => place(currentTurn.weakenedRoll)}
              className="flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors"
              style={{ borderColor: `${HAZARD}66`, background: `${HAZARD}14` }}
            >
              <span className="font-body text-sm font-bold" style={{ color: HAZARD }}>
                Secretly weaken it
              </span>
              <span className="font-display text-lg font-extrabold" style={{ color: HAZARD }}>
                {currentTurn.weakenedRoll}
              </span>
            </button>
          </div>
        ) : (
          <PrimaryButton onClick={() => place(currentTurn.naturalRoll)}>Place beam</PrimaryButton>
        )}
      </MinigamePanel>
    );
  }

  // revealed
  const total = placed.reduce((a, b) => a + b, 0);
  const buildersWon = total >= roundState.threshold;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Structural test
      </p>
      <div className="mb-5 grid grid-cols-4 gap-2">
        {roundState.turns.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-line bg-surface py-3"
          >
            <span className="font-display text-base font-extrabold text-text-hi">{placed[i]}</span>
            <span className="font-mono text-[9px] text-text-low">{playerById.get(t.playerId)?.name.slice(0, 4)}</span>
          </motion.div>
        ))}
      </div>
      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-low">Total load</span>
        <span
          className="font-display text-3xl font-extrabold tabular-nums"
          style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}
        >
          {total}
        </span>
        <span className="font-mono text-[11px] text-text-low">/ needs {roundState.threshold}</span>
      </div>
      <p className="mb-5 text-center font-body text-sm text-text-mid">
        The tower{' '}
        <span className="font-bold" style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}>
          {buildersWon ? 'holds' : 'buckles'}
        </span>
        .
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: `Tower reached ${total} load (needed ${roundState.threshold}) \u2014 it ${
              buildersWon ? 'held' : 'buckled'
            }.`,
          })
        }
      >
        Continue
      </PrimaryButton>
    </MinigamePanel>
  );
}
