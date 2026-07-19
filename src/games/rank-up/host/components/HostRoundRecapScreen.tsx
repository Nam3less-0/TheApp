import RoundRecapView from '../../components/RoundRecapView';
import { useRankUpHost } from '../context';

export default function HostRoundRecapScreen() {
  const { room, players, roundNumber, roundPointsByPlayer } = useRankUpHost();

  if (!room) return null;

  return (
    <RoundRecapView
      players={players}
      roundNumber={roundNumber}
      roundPointsByPlayer={roundPointsByPlayer}
      showHostActions={false}
    />
  );
}
