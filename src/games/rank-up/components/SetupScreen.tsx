import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRankUp } from '../context';
import ErrorPanel from './ErrorPanel';
import OnboardingCards from './OnboardingCards';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSectionHeading,
} from './Layout';

interface SetupScreenProps {
  onShowRules?: () => void;
}

export default function SetupScreen({ onShowRules }: SetupScreenProps) {
  const { local, supabaseReady, createGame, joinGame } = useRankUp();
  const [playerName, setPlayerName] = useState(local.playerName || '');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [gameMode, setGameMode] = useState<'classic' | 'teams'>('classic');
  const [showRules, setShowRules] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const join = searchParams.get('join');
    if (join && join.length === 4) {
      setMode('join');
      setRoomCode(join.toUpperCase());
    }
  }, [searchParams]);

  const canSubmit = playerName.trim().length > 0 && (mode === 'create' || roomCode.trim().length === 4);

  async function handleSubmit() {
    if (!canSubmit) return;
    if (mode === 'create') {
      await createGame(playerName.trim(), gameMode);
    } else {
      await joinGame(roomCode.trim(), playerName.trim());
    }
  }

  function handleRetry() {
    if (mode === 'create') {
      void createGame(playerName.trim(), gameMode);
    } else if (roomCode.trim().length === 4) {
      void joinGame(roomCode.trim(), playerName.trim());
    }
  }

  if (showRules) {
    return (
      <OnboardingCards
        onComplete={() => {
          setShowRules(false);
          onShowRules?.();
        }}
      />
    );
  }

  return (
    <RankUpPageWrap>
      <header className="mb-8">
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Rank Up
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-text-mid">
          Read the ranker&apos;s mind. Create a room or join with a code — everyone plays on their
          own phone.
        </p>
        <button
          type="button"
          onClick={() => setShowRules(true)}
          className="mt-2 font-mono text-[11px] text-pewter underline-offset-2 hover:underline"
        >
          How to play
        </button>
      </header>

      {!supabaseReady && (
        <ErrorPanel message="Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server." />
      )}

      {local.syncError && (
        <ErrorPanel
          message={local.syncError}
          onRetry={canSubmit && supabaseReady ? handleRetry : undefined}
        />
      )}

      <div className="flex flex-col gap-6">
        <RankUpPanel compact>
          <RankUpSectionHeading title="Your name" className="mb-4" />
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={24}
            className="w-full rounded-xl border border-line bg-deep px-4 py-3 font-body text-[15px] text-text-hi outline-none focus-visible:border-pewter focus-visible:ring-1 focus-visible:ring-pewter"
          />
        </RankUpPanel>

        <RankUpPanel compact>
          <RankUpSectionHeading title="Room" className="mb-4" />
          <div className="mb-4 grid grid-cols-2 gap-3">
            {(
              [
                { id: 'create' as const, label: 'Create room', hint: 'Get a code for friends' },
                { id: 'join' as const, label: 'Join room', hint: 'Enter a 4-letter code' },
              ] as const
            ).map((entry) => {
              const selected = mode === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setMode(entry.id)}
                  className={`rounded-xl border bg-surface p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter ${
                    selected
                      ? 'border-pewter shadow-[0_0_0_1px_#9B93A8_inset]'
                      : 'border-line hover:border-line-bright'
                  }`}
                  aria-pressed={selected}
                >
                  <p className="font-body text-sm font-bold text-text-hi">{entry.label}</p>
                  <p className="mt-1 font-body text-[12px] text-text-mid">{entry.hint}</p>
                </button>
              );
            })}
          </div>

          {mode === 'join' && (
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
              placeholder="ABCD"
              maxLength={4}
              className="w-full rounded-xl border border-line bg-deep px-4 py-3 font-mono text-xl tracking-[0.3em] text-text-hi uppercase outline-none focus-visible:border-pewter focus-visible:ring-1 focus-visible:ring-pewter"
            />
          )}

          {mode === 'create' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(
                [
                  { id: 'classic' as const, label: 'Classic', hint: 'Free-for-all on phones' },
                  { id: 'teams' as const, label: '2v2 Teams', hint: 'Exactly 4 players' },
                ] as const
              ).map((entry) => {
                const selected = gameMode === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setGameMode(entry.id)}
                    className={`rounded-xl border bg-surface p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter ${
                      selected
                        ? 'border-pewter shadow-[0_0_0_1px_#9B93A8_inset]'
                        : 'border-line hover:border-line-bright'
                    }`}
                    aria-pressed={selected}
                  >
                    <p className="font-body text-sm font-bold text-text-hi">{entry.label}</p>
                    <p className="mt-1 font-body text-[12px] text-text-mid">{entry.hint}</p>
                  </button>
                );
              })}
            </div>
          )}
        </RankUpPanel>

        <RankUpPrimaryButton onClick={handleSubmit} disabled={!canSubmit || !supabaseReady || local.isConnecting}>
          {local.isConnecting
            ? 'Connecting…'
            : mode === 'create'
              ? 'Create room'
              : 'Join room'}
        </RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
