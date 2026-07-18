import { useState } from 'react';
import { useRankUp } from '../context';
import { RankUpSecondaryButton } from './Layout';

interface AbandonRoundButtonProps {
  className?: string;
}

export default function AbandonRoundButton({ className = '' }: AbandonRoundButtonProps) {
  const { local, room, isHost, isRanker, abandonRound } = useRankUp();
  const [busy, setBusy] = useState(false);

  const isDrafting = local.localPhase === 'compose' || local.localPhase === 'ranker-rank';
  const roundInProgress = room != null && room.phase !== 'lobby';
  const canAbandon = (isHost || isRanker) && (isDrafting || roundInProgress);

  if (!canAbandon) return null;

  const label = isDrafting ? 'Cancel round' : 'Abandon round';
  const confirmMessage = isDrafting
    ? 'Cancel this round setup and return to the lobby?'
    : 'Abandon the current round for everyone and return to the lobby? Scores are kept.';

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;

    setBusy(true);
    try {
      await abandonRound();
    } finally {
      setBusy(false);
    }
  }

  return (
    <RankUpSecondaryButton
      onClick={handleClick}
      disabled={busy}
      className={`w-full text-center text-bad hover:border-bad/40 hover:text-bad ${className}`}
    >
      {busy ? 'Abandoning…' : label}
    </RankUpSecondaryButton>
  );
}
