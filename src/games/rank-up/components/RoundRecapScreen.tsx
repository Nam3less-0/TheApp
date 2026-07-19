import { useRankUp } from '../context';
import { useSessionUI } from '../sessionUi';
import RoundRecapView from './RoundRecapView';

export default function RoundRecapScreen() {
  const { local, room, players, teams, isTeamsGame, roundNumber, isHost, startNewRound, leaveGame } =
    useRankUp();
  const { roundPointsByPlayer } = useSessionUI();

  if (!room) return null;

  return (
    <RoundRecapView
      players={players}
      teams={teams}
      isTeamsGame={isTeamsGame}
      roundNumber={roundNumber}
      roundPointsByPlayer={roundPointsByPlayer}
      highlightPlayerId={local.playerId}
      showHostActions={isHost}
      onStartRound={() => startNewRound()}
      onLeave={() => leaveGame()}
    />
  );
}
