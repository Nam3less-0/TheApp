import { useRankUpHost } from '../context';
import RankUpPanel, { RankUpPrimaryButton } from '../../components/Layout';

export default function HostRoundRecapScreen() {
  const { room, roundNumber, startNewRound } = useRankUpHost();

  if (!room) return null;

  return (
    <RankUpPanel compact className="mx-auto max-w-xl border-[#6FA3C4]/25 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
        Round {roundNumber} complete
      </p>
      <p className="mt-2 font-body text-sm text-text-mid">
        Standings are on the board above. Start the next round when everyone is ready.
      </p>
      <RankUpPrimaryButton onClick={() => startNewRound()} className="mt-5 w-full">
        Start Round {roundNumber + 1}
      </RankUpPrimaryButton>
    </RankUpPanel>
  );
}
