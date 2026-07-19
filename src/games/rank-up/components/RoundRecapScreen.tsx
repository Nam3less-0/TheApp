import { useRankUp } from '../context';
import { useSessionUI } from '../sessionUi';
import RoundRecapView from './RoundRecapView';

export default function RoundRecapScreen() {
  const {
    local,
    room,
    players,
    teams,
    isTeamsGame,
    roundNumber,
    canStartRound,
    startNewRound,
    leaveGame,
  } = useRankUp();
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
      showHostActions={canStartRound}
      onStartRound={() => startNewRound()}
      onLeave={() => leaveGame()}
    />
  );
}
