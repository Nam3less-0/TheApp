import type { Player } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { VIOLET } from './MinigamePanel';

interface PassGateProps {
  player: Player;
  label?: string;
  onReady: () => void;
}

/**
 * Full-width "pass the phone to X" checkpoint shown before a player's
 * private turn. Requires an explicit tap so the previous player has a beat
 * to physically hand the device over before anything sensitive renders.
 * The parent owns the sub-phase and stops rendering this once onReady fires.
 */
export default function PassGate({ player, label = 'Pass the phone to', onReady }: PassGateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-5 py-10 text-center">
      <PlayerAvatar name={player.name} size="lg" />
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">{label}</p>
      <h2 className="font-display text-2xl font-extrabold text-text-hi">{player.name}</h2>
      <button
        type="button"
        onClick={onReady}
        className="mt-2 rounded-full border px-5 py-2.5 font-body text-sm font-bold text-void"
        style={{ background: VIOLET, borderColor: VIOLET }}
      >
        I have the phone
      </button>
    </div>
  );
}
