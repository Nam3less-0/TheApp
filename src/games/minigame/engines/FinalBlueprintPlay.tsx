import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayProps, Player } from '../types';
import type { FinalBlueprintState } from './finalBlueprint';
import PassGate from '../components/PassGate';
import MinigamePanel from '../components/MinigamePanel';
import { PrimaryButton, HAZARD } from '../components/MinigamePanel';

type Stage = 'gate' | 'seal' | 'discuss' | 'inspect' | 'revealed';

export default function FinalBlueprintPlay({ roundState, players, saboteurId, onResolve }: PlayProps<FinalBlueprintState>) {
  const [sealIndex, setSealIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('gate');
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const currentSealer = playerById.get(roundState.tileOrder[sealIndex]);

  function sealTile() {
    if (sealIndex + 1 < roundState.tileOrder.length) {
      setSealIndex((i) => i + 1);
      setStage('gate');
    } else {
      setStage('discuss');
    }
  }

  function pickTile(i: number) {
    setPickedIndex(i);
    setStage('revealed');
  }

  if (stage === 'gate' && currentSealer) {
    return <PassGate player={currentSealer} label="Pass to seal a tile:" onReady={() => setStage('seal')} />;
  }

  if (stage === 'seal' && currentSealer) {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          {currentSealer.name}&rsquo;s tile
        </p>
        <div className="mb-6 flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-line-bright">
          <span className="font-display text-lg font-bold text-text-low">Face-down</span>
        </div>
        <PrimaryButton onClick={sealTile}>Seal it in</PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'discuss') {
    return (
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[#D6294A]">
          Final discussion
        </p>
        <h2 className="mb-4 text-center font-display text-xl font-extrabold text-text-hi">
          All four tiles are sealed
        </h2>
        <p className="mb-6 text-center font-body text-sm text-text-mid">
          Talk it through one last time. Everything from tonight comes down to this. You get one flip.
        </p>
        <PrimaryButton onClick={() => setStage('inspect')}>Move to the final inspection</PrimaryButton>
      </MinigamePanel>
    );
  }

  if (stage === 'inspect') {
    return (
      <MinigamePanel>
        <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Pick one tile to flip
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {roundState.tileOrder.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pickTile(i)}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-line-bright font-display text-lg font-bold text-text-low transition-colors hover:border-[#D6294A]"
            >
              ?
            </button>
          ))}
        </div>
      </MinigamePanel>
    );
  }

  // revealed
  const pickedPlayerId = pickedIndex !== null ? roundState.tileOrder[pickedIndex] : null;
  const wasCracked = pickedPlayerId === saboteurId;
  const buildersWon = wasCracked;
  const pickedPlayer = pickedPlayerId ? playerById.get(pickedPlayerId) : undefined;

  return (
    <MinigamePanel>
      <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
        Final inspection
      </p>
      <div className="mb-6 grid grid-cols-4 gap-2.5">
        {roundState.tileOrder.map((pid, i) => {
          const isPicked = i === pickedIndex;
          const cracked = pid === saboteurId;
          return (
            <motion.div
              key={i}
              initial={{ rotateY: 0 }}
              animate={isPicked ? { rotateY: [0, 180, 360] } : {}}
              transition={{ duration: 0.7 }}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 text-center"
              style={{
                borderColor: isPicked ? (cracked ? '#7ED9A4' : HAZARD) : 'rgba(220,224,232,0.16)',
                background: isPicked
                  ? cracked
                    ? 'rgba(126,217,164,0.14)'
                    : `${HAZARD}18`
                  : 'transparent',
              }}
            >
              <span className="text-xl">{isPicked ? (cracked ? '\u26a0\ufe0f' : '\u2714\ufe0f') : '\ud83d\udd12'}</span>
              {isPicked && (
                <span className="font-mono text-[9px] text-text-low">{playerById.get(pid)?.name.slice(0, 5)}</span>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="mb-6 text-center font-body text-sm text-text-mid">
        {pickedPlayer?.name}&rsquo;s tile was{' '}
        <span className="font-bold" style={{ color: wasCracked ? '#7ED9A4' : HAZARD }}>
          {wasCracked ? 'Cracked' : 'Reinforced'}
        </span>
        .
      </p>
      <PrimaryButton
        onClick={() =>
          onResolve({
            buildersWon,
            summary: wasCracked
              ? `The group correctly flipped ${pickedPlayer?.name}\u2019s cracked tile.`
              : `The group flipped ${pickedPlayer?.name}\u2019s tile \u2014 it was clean.`,
          })
        }
      >
        See the final results
      </PrimaryButton>
    </MinigamePanel>
  );
}
