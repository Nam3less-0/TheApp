import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps, Player } from '../types';
import type { WiringState } from './wiring';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type SubPhase = 'gate' | 'turn' | 'revealed';

export default function WiringPlay({ roundState, players, onResolve }: PlayProps<WiringState>) {
  const [subPhase, setSubPhase] = useState<SubPhase>('gate');
  const [turnIndex, setTurnIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Array<'placed' | 'skipped'>>([]);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const currentTurn = roundState.turns[turnIndex];
  const currentPlayer = currentTurn ? playerById.get(currentTurn.playerId) : undefined;

  function act(result: 'placed' | 'skipped') {
    const next = [...outcomes, result];
    setOutcomes(next);
    if (turnIndex + 1 < roundState.turns.length) {
      setTurnIndex((i) => i + 1);
      setSubPhase('gate');
    } else {
      setSubPhase('revealed');
    }
  }

  if (subPhase === 'gate' && currentPlayer) {
    return <PassGate player={currentPlayer} label="Pass to check your hand:" onReady={() => setSubPhase('turn')} />;
  }

  if (subPhase === 'turn' && currentPlayer && currentTurn) {
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentPlayer.name} — connector {turnIndex + 1} of {roundState.turns.length}
        </p>
        <h2 className="mb-6 text-center font-display text-xl font-extrabold text-text-hi">
          {currentTurn.trulyHasPiece ? 'You have a valid connector' : 'No valid connector this turn'}
        </h2>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => act('placed')}
            disabled={!currentTurn.trulyHasPiece}
            className="rounded-xl border border-line bg-surface px-4 py-3.5 font-body text-sm font-bold text-text-hi transition-colors hover:border-[#9BC53D] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Place connector
          </button>
          <button
            type="button"
            onClick={() => act('skipped')}
            className="rounded-xl border px-4 py-3.5 font-body text-sm font-bold transition-colors"
            style={{ borderColor: `${HAZARD}66`, background: `${HAZARD}14`, color: HAZARD }}
          >
            Skip this turn
          </button>
        </div>
      </MinigamePanel>
    );
  }

  // revealed
  const skipCount = outcomes.filter((o) => o === 'skipped').length;
  const buildersWon = skipCount <= 1;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Circuit test
      </p>
      <div className="mb-5 flex items-center justify-center gap-1.5">
        {outcomes.map((o, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="flex h-8 w-8 items-center justify-center rounded-full border text-sm"
            style={
              o === 'placed'
                ? { borderColor: '#7ED9A466', background: '#7ED9A422', color: '#7ED9A4' }
                : { borderColor: `${HAZARD}66`, background: `${HAZARD}22`, color: HAZARD }
            }
          >
            {o === 'placed' ? '\u2713' : '\u2715'}
          </motion.span>
        ))}
      </div>
      <p className="mb-5 text-center font-body text-sm text-text-mid">
        {skipCount} skip{skipCount === 1 ? '' : 's'} across the run — the circuit{' '}
        <span className="font-bold" style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}>
          {buildersWon ? 'connects' : 'shorts out'}
        </span>
        .
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: `${skipCount} skip${skipCount === 1 ? '' : 's'} \u2014 circuit ${
              buildersWon ? 'connected' : 'shorted out'
            }.`,
          })
        }
      >
        Continue
      </PrimaryButton>
    </MinigamePanel>
  );
}
