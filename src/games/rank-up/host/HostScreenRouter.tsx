import type { ReactNode } from 'react';
import { useRankUpHost } from './context';
import HostLobbyScreen from './components/HostLobbyScreen';
import HostProgressScreen from './components/HostProgressScreen';
import HostRevealScreen from './components/HostRevealScreen';
import HostRoundRecapScreen from './components/HostRoundRecapScreen';
import HostDisplayLayout from './components/HostDisplayLayout';
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

  let screen: ReactNode;

  switch (room.phase) {
    case 'guessing':
    case 'display':
      screen = <HostProgressScreen />;
      break;
    case 'reveal':
      screen = <HostRevealScreen />;
      break;
    case 'round-recap':
      screen = <HostRoundRecapScreen />;
      break;
    case 'lobby':
    default:
      screen = <HostLobbyScreen />;
  }

  return <HostDisplayLayout>{screen}</HostDisplayLayout>;
}
