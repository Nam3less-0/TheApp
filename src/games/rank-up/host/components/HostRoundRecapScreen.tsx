import RoundRecapView from '../../components/RoundRecapView';
import { useRankUpHost } from '../context';

export default function HostRoundRecapScreen() {
  const { room, players, roundNumber, roundPointsByPlayer, isGameroom, startNewRound } =
    useRankUpHost();

  if (!room) return null;

  return (
    <RoundRecapView
      players={players}
      roundNumber={roundNumber}
      roundPointsByPlayer={roundPointsByPlayer}
      showHostActions={isGameroom}
      onStartRound={() => startNewRound()}
    />
  );
}
