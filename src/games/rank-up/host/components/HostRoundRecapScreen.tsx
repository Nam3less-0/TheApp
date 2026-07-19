import RoundRecapView from '../../components/RoundRecapView';
import { useRankUpHost } from '../context';

export default function HostRoundRecapScreen() {
  const { room, players, roundNumber, roundPointsByPlayer, startNewRound } = useRankUpHost();

  if (!room) return null;

  return (
    <RoundRecapView
      players={players}
      roundNumber={roundNumber}
      roundPointsByPlayer={roundPointsByPlayer}
      showHostActions
      onStartRound={() => startNewRound()}
    />
  );
}
