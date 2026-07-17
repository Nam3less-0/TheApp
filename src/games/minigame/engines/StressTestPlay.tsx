import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps, Player } from '../types';
import type { StressAction, StressTestState } from './stressTest';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type Stage = 'gate' | 'ready' | 'signal' | 'react' | 'turn-result' | 'revealed';

const SIGNAL_MS = 1200;
const REACT_MS = 2500;

export default function StressTestPlay({ roundState, players, onResolve }: PlayProps<StressTestState>) {
  const [turnIndex, setTurnIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('gate');
  const [results, setResults] = useState<boolean[]>([]);
  const [lastTapped, setLastTapped] = useState<StressAction | 'timeout' | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const currentTurn = roundState.turns[turnIndex];
  const currentPlayer = currentTurn ? playerById.get(currentTurn.playerId) : undefined;

  useEffect(() => {
    if (stage === 'signal') {
      timerRef.current = setTimeout(() => setStage('react'), SIGNAL_MS);
    }
    if (stage === 'react') {
      timerRef.current = setTimeout(() => settle('timeout'), REACT_MS);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function settle(tapped: StressAction | 'timeout') {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLastTapped(tapped);
    const success = tapped === currentTurn.correctAction;
    setResults((r) => [...r, success]);
    setStage('turn-result');
  }

  function nextTurn() {
    if (turnIndex + 1 < roundState.turns.length) {
      setTurnIndex((i) => i + 1);
      setStage('gate');
      setLastTapped(null);
    } else {
      setStage('revealed');
    }
  }

  if (stage === 'gate' && currentPlayer) {
    return <PassGate player={currentPlayer} label="Pass to react:" onReady={() => setStage('ready')} />;
  }

  if (stage === 'ready' && currentPlayer) {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentPlayer.name}, brace yourself
        </p>
        <p className="mb-6 text-center font-body text-sm text-text-mid">
          A signal flashes for a beat. React fast once the buttons light up.
        </p>
        <PrimaryButton onClick={() => setStage('signal')}>Ready</PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'signal' && currentTurn) {
    return (
      <MinigamePanel>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex min-h-[180px] flex-col items-center justify-center gap-2"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">Signal</span>
          <span className="font-display text-3xl font-extrabold uppercase text-text-hi">
            {currentTurn.correctAction === 'reinforce' ? 'Reinforce' : 'Vent'}
          </span>
        </motion.div>
      </MinigamePanel>
    );
  }

  if (stage === 'react' && currentTurn) {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: HAZARD }}>
          Go — go — go
        </p>
        <motion.div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
          <motion.div
            className="h-full rounded-full"
            style={{ background: HAZARD }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: REACT_MS / 1000, ease: 'linear' }}
          />
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => settle('reinforce')}
            className="flex min-h-[100px] items-center justify-center rounded-2xl border border-line bg-surface font-display text-base font-bold text-text-hi transition-colors hover:border-good"
          >
            Reinforce
          </button>
          <button
            type="button"
            onClick={() => settle('vent')}
            className="flex min-h-[100px] items-center justify-center rounded-2xl border border-line bg-surface font-display text-base font-bold text-text-hi transition-colors hover:border-[#E8A33D]"
          >
            Vent
          </button>
        </div>
      </MinigamePanel>
    );
  }

  if (stage === 'turn-result' && currentTurn && currentPlayer) {
    const success = results[results.length - 1];
    return (
      <MinigamePanel>
        <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentPlayer.name}
        </p>
        <h2
          className="mb-2 text-center font-display text-xl font-extrabold"
          style={{ color: success ? '#7ED9A4' : HAZARD }}
        >
          {success ? 'Correct reaction' : lastTapped === 'timeout' ? 'Too slow' : 'Wrong reaction'}
        </h2>
        <p className="mb-6 text-center font-body text-sm text-text-mid">
          Signal was <span className="font-bold text-text-hi">{currentTurn.correctAction}</span>.
        </p>
        <PrimaryButton onClick={nextTurn}>
          {turnIndex + 1 < roundState.turns.length ? 'Next player' : 'See final result'}
        </PrimaryButton>
      </MinigamePanel>
    );
  }

  // revealed
  const successCount = results.filter(Boolean).length;
  const buildersWon = successCount === roundState.turns.length;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Structural readout
      </p>
      <div className="mb-5 flex items-center justify-center gap-2">
        {results.map((r, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex h-9 w-9 items-center justify-center rounded-full border text-base"
            style={
              r
                ? { borderColor: '#7ED9A466', background: '#7ED9A422', color: '#7ED9A4' }
                : { borderColor: `${HAZARD}66`, background: `${HAZARD}22`, color: HAZARD }
            }
          >
            {r ? '\u2713' : '\u2715'}
          </motion.span>
        ))}
      </div>
      <p className="mb-5 text-center font-body text-sm text-text-mid">
        {successCount} of {roundState.turns.length} correct &mdash; the structure{' '}
        <span className="font-bold" style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}>
          {buildersWon ? 'holds' : 'fails'}
        </span>
        .
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: `${successCount} of ${roundState.turns.length} reacted correctly.`,
          })
        }
      >
        Continue
      </PrimaryButton>
    </MinigamePanel>
  );
}
