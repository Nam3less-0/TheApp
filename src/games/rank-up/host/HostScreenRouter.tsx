import { useRankUpHost } from './context';
import HostLobbyScreen from './components/HostLobbyScreen';
import HostProgressScreen from './components/HostProgressScreen';
import HostRevealScreen from './components/HostRevealScreen';
import HostRoundRecapScreen from './components/HostRoundRecapScreen';
import RejoiningSkeleton from '../components/RejoiningSkeleton';
import ErrorPanel from '../components/ErrorPanel';
import { RankUpPageWrap, RankUpSecondaryButton } from '../components/Layout';

export default function HostScreenRouter() {
  const { roomCode, room, syncError, disconnect } = useRankUpHost();

  if (!roomCode) {
    return null;
  }

  if (!room && !syncError) {
    return <RejoiningSkeleton />;
  }

  if (!room && syncError) {
    return (
      <RankUpPageWrap>
        <ErrorPanel message={syncError} />
        <RankUpSecondaryButton onClick={disconnect} className="mt-4 w-full text-center">
          Back to code entry
        </RankUpSecondaryButton>
      </RankUpPageWrap>
    );
  }

  if (!room) {
    return <RejoiningSkeleton />;
  }

  switch (room.phase) {
    case 'guessing':
    case 'display':
      return <HostProgressScreen />;
    case 'reveal':
      return <HostRevealScreen />;
    case 'round-recap':
      return <HostRoundRecapScreen />;
    case 'lobby':
    default:
      return <HostLobbyScreen />;
  }
}
