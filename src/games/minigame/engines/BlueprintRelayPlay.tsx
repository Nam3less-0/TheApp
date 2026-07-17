import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps, Player } from '../types';
import type { BlueprintRelayState } from './blueprintRelay';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD, VIOLET } from '../components/MinigamePanel';

type Stage = 'gate' | 'peek' | 'relay-ack' | 'reconstruct' | 'revealed';

function Grid3x3({
  filled,
  interactiveOnClick,
  accent,
}: {
  filled: number[];
  interactiveOnClick?: (i: number) => void;
  accent: string;
}) {
  return (
    <div className="mx-auto grid w-fit grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, i) => {
        const on = filled.includes(i);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactiveOnClick}
            onClick={() => interactiveOnClick?.(i)}
            className="h-16 w-16 rounded-lg border-2 transition-colors"
            style={{
              borderColor: on ? accent : 'rgba(220,224,232,0.16)',
              background: on ? `${accent}33` : 'transparent',
              cursor: interactiveOnClick ? 'pointer' : 'default',
            }}
          />
        );
      })}
    </div>
  );
}

export default function BlueprintRelayPlay({ roundState, players, onResolve }: PlayProps<BlueprintRelayState>) {
  const [linkIndex, setLinkIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('gate');
  const [selected, setSelected] = useState<number[]>([]);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const isLastLink = linkIndex === roundState.chainOrder.length - 1;
  const currentPlayer = playerById.get(roundState.chainOrder[linkIndex]);

  function advance() {
    if (isLastLink) {
      setStage('reconstruct');
    } else {
      setLinkIndex((i) => i + 1);
      setStage('gate');
    }
  }

  function toggleCell(i: number) {
    setSelected((prev) => {
      if (prev.includes(i)) return prev.filter((c) => c !== i);
      if (prev.length >= 4) return prev;
      return [...prev, i];
    });
  }

  if (stage === 'gate' && currentPlayer) {
    return (
      <PassGate
        player={currentPlayer}
        label={linkIndex === 0 ? 'The blueprint starts with:' : 'Pass it along to:'}
        onReady={() => setStage(linkIndex === 0 ? 'peek' : 'relay-ack')}
      />
    );
  }

  if (stage === 'peek') {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Memorise this, then describe it out loud
        </p>
        <Grid3x3 filled={roundState.targetCells} accent={VIOLET} />
        <p className="mt-5 text-center font-body text-sm text-text-mid">
          Tell {playerById.get(roundState.chainOrder[1])?.name} which 4 squares are marked &mdash; use rows,
          columns, corners, whatever helps.
        </p>
        <div className="mt-5">
          <PrimaryButton onClick={advance}>I&rsquo;ve told them &mdash; pass it on</PrimaryButton>
        </div>
      </MinigamePanel>
    );
  }

  if (stage === 'relay-ack' && currentPlayer) {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Listen closely
        </p>
        <h2 className="mb-5 text-center font-display text-xl font-extrabold text-text-hi">
          {currentPlayer.name}, what did you hear?
        </h2>
        <p className="mb-5 text-center font-body text-sm text-text-mid">
          Once you&rsquo;ve got it, pass it on to{' '}
          {isLastLink ? 'no one \u2014 you rebuild it' : playerById.get(roundState.chainOrder[linkIndex + 1])?.name}.
        </p>
        <PrimaryButton onClick={advance}>
          {isLastLink ? "I've got it — I'll rebuild it" : "I've told them — pass it on"}
        </PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'reconstruct' && currentPlayer) {
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentPlayer.name}&rsquo;s rebuild
        </p>
        <h2 className="mb-5 text-center font-display text-xl font-extrabold text-text-hi">
          Tap the 4 marked squares
        </h2>
        <Grid3x3 filled={selected} interactiveOnClick={toggleCell} accent={VIOLET} />
        <p className="mt-4 text-center font-mono text-[11px] text-text-low">{selected.length} / 4 selected</p>
        <div className="mt-5">
          <PrimaryButton disabled={selected.length !== 4} onClick={() => setStage('revealed')}>
            Lock in the rebuild
          </PrimaryButton>
        </div>
      </MinigamePanel>
    );
  }

  // revealed
  const correct = selected.filter((c) => roundState.targetCells.includes(c)).length;
  const buildersWon = correct >= 3;

  return (
    <MinigamePanel>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Blueprint vs. rebuild
      </p>
      <div className="mx-auto grid w-fit grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => {
          const wasTarget = roundState.targetCells.includes(i);
          const wasSelected = selected.includes(i);
          const match = wasTarget && wasSelected;
          const miss = wasTarget && !wasSelected;
          const falseAdd = !wasTarget && wasSelected;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex h-16 w-16 items-center justify-center rounded-lg border-2 text-lg"
              style={{
                borderColor: match ? '#7ED9A4' : miss ? HAZARD : falseAdd ? HAZARD : 'rgba(220,224,232,0.16)',
                background: match
                  ? 'rgba(126,217,164,0.18)'
                  : miss || falseAdd
                    ? `${HAZARD}18`
                    : 'transparent',
              }}
            >
              {match ? '\u2713' : miss ? '\u2715' : falseAdd ? '?' : ''}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-5 text-center font-body text-sm text-text-mid">
        <span className="font-bold" style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}>
          {correct} of 4
        </span>{' '}
        cells matched.
      </p>
      <div className="mt-5">
        <PrimaryButton
          onClick={() =>
            onResolve({
              buildersWon,
              summary: `Rebuild matched ${correct} of 4 marked cells.`,
            })
          }
        >
          Continue
        </PrimaryButton>
      </div>
    </MinigamePanel>
  );
}
