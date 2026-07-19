import type { ReactNode } from 'react';
import { useRankUpHost } from '../context';
import { isAwaitingRoundStart } from '../../sync/types';
import HostLeaderboard from './HostLeaderboard';

export default function HostDisplayLayout({ children }: { children: ReactNode }) {
  const { room } = useRankUpHost();
  const preRound = Boolean(room && isAwaitingRoundStart(room));

  if (preRound) {
    return <div className="mx-auto max-w-[960px] px-4 py-8">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:py-8">
      <HostLeaderboard variant="hero" />
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
