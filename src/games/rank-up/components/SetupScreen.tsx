import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatSupabaseError, isSupabaseConfigured } from '../../../lib/supabase';
import { useRankUp } from '../context';
import { createGameroomRoom } from '../sync/roomApi';
import type { GameMode } from '../sync/types';
import ErrorPanel from './ErrorPanel';
import OnboardingCards from './OnboardingCards';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
  RankUpSectionHeading,
} from './Layout';

type SetupStep = 'choose' | 'join' | 'create-mode';

interface SetupScreenProps {
  onShowRules?: () => void;
}

function OptionCard({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border bg-surface p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter ${
        selected
          ? 'border-pewter shadow-[0_0_0_1px_#9B93A8_inset]'
          : 'border-line hover:border-line-bright'
      }`}
      aria-pressed={selected}
    >
      <p className="font-body text-sm font-bold text-text-hi">{label}</p>
      <p className="mt-1 font-body text-[12px] leading-snug text-text-mid">{hint}</p>
    </button>
  );
}

export default function SetupScreen({ onShowRules }: SetupScreenProps) {
  const navigate = useNavigate();
  const { local, supabaseReady, createGame, joinGame } = useRankUp();
  const [step, setStep] = useState<SetupStep>('choose');
  const [playerName, setPlayerName] = useState(local.playerName || '');
  const [roomCode, setRoomCode] = useState('');
  const [createMode, setCreateMode] = useState<'classic' | 'teams' | 'gameroom'>('classic');
  const [showRules, setShowRules] = useState(false);
  const [gameroomConnecting, setGameroomConnecting] = useState(false);
  const [gameroomError, setGameroomError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const join = searchParams.get('join');
    if (join && join.length === 4) {
      setStep('join');
      setRoomCode(join.toUpperCase());
    }
  }, [searchParams]);

  const canJoin = playerName.trim().length > 0 && roomCode.trim().length === 4;
  const canCreatePlayerRoom = playerName.trim().length > 0;
  const canConfirmCreate = createMode === 'gameroom' || canCreatePlayerRoom;
  const isBusy = local.isConnecting || gameroomConnecting;

  async function handleJoin() {
    if (!canJoin) return;
    await joinGame(roomCode.trim(), playerName.trim());
  }

  async function handleCreatePlayerRoom(gameMode: GameMode) {
    if (!canCreatePlayerRoom) return;
    await createGame(playerName.trim(), gameMode);
  }

  async function handleCreateGameroom() {
    if (!isSupabaseConfigured()) {
      setGameroomError('Supabase is not configured.');
      return;
    }

    setGameroomConnecting(true);
    setGameroomError(null);

    try {
      const room = await createGameroomRoom();
      navigate(`/play/rank-up/host/${room.code}`);
    } catch (error) {
      setGameroomError(formatSupabaseError(error, 'Could not create gameroom.'));
      setGameroomConnecting(false);
    }
  }

  async function handleConfirmCreate() {
    if (createMode === 'gameroom') {
      await handleCreateGameroom();
      return;
    }
    await handleCreatePlayerRoom(createMode);
  }

  function handleRetry() {
    if (step === 'join' && canJoin) {
      void handleJoin();
    } else if (step === 'create-mode' && canConfirmCreate) {
      void handleConfirmCreate();
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

  const displayError = gameroomError ?? local.syncError;

  return (
    <RankUpPageWrap>
      <header className="mb-8">
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Rank Up
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-text-mid">
          {step === 'choose'
            ? 'Create a new room or join friends with a code.'
            : step === 'join'
              ? 'Enter your name and the room code from the host.'
              : 'Pick how this device participates — phone play or big-screen gameroom.'}
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

      {displayError ? (
        <ErrorPanel
          message={displayError}
          onRetry={
            supabaseReady && !isBusy && (step === 'join' ? canJoin : step === 'create-mode' && canConfirmCreate)
              ? handleRetry
              : undefined
          }
        />
      ) : null}

      {step === 'choose' ? (
        <div className="flex flex-col gap-3">
          <OptionCard
            label="Create room"
            hint="Start a new game and invite friends"
            onClick={() => setStep('create-mode')}
          />
          <OptionCard
            label="Join room"
            hint="Enter a 4-letter code from the host"
            onClick={() => setStep('join')}
          />
        </div>
      ) : null}

      {step === 'join' ? (
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
            <RankUpSectionHeading title="Room code" className="mb-4" />
            <input
              type="text"
              value={roomCode}
              onChange={(e) =>
                setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))
              }
              placeholder="ABCD"
              maxLength={4}
              className="w-full rounded-xl border border-line bg-deep px-4 py-3 font-mono text-xl tracking-[0.3em] text-text-hi uppercase outline-none focus-visible:border-pewter focus-visible:ring-1 focus-visible:ring-pewter"
            />
          </RankUpPanel>

          <RankUpPrimaryButton
            onClick={() => void handleJoin()}
            disabled={!canJoin || !supabaseReady || isBusy}
          >
            {local.isConnecting ? 'Joining…' : 'Join room'}
          </RankUpPrimaryButton>

          <RankUpSecondaryButton onClick={() => setStep('choose')} className="w-full text-center">
            Back
          </RankUpSecondaryButton>
        </div>
      ) : null}

      {step === 'create-mode' ? (
        <div className="flex flex-col gap-6">
          {createMode !== 'gameroom' ? (
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
          ) : null}

          <RankUpPanel compact>
            <RankUpSectionHeading title="How will you play?" className="mb-4" />
            <div className="flex flex-col gap-3">
              <OptionCard
                label="Play classic"
                hint="Free-for-all on this phone — everyone ranks and guesses"
                selected={createMode === 'classic'}
                onClick={() => setCreateMode('classic')}
              />
              <OptionCard
                label="Play gameroom"
                hint="This device becomes the big screen — players join on their phones"
                selected={createMode === 'gameroom'}
                onClick={() => setCreateMode('gameroom')}
              />
              <OptionCard
                label="2v2 teams"
                hint="Exactly 4 players split into two teams"
                selected={createMode === 'teams'}
                onClick={() => setCreateMode('teams')}
              />
            </div>
          </RankUpPanel>

          <RankUpPrimaryButton
            onClick={() => void handleConfirmCreate()}
            disabled={!canConfirmCreate || !supabaseReady || isBusy}
          >
            {gameroomConnecting
              ? 'Opening gameroom…'
              : local.isConnecting
                ? 'Creating…'
                : createMode === 'gameroom'
                  ? 'Create gameroom'
                  : createMode === 'teams'
                    ? 'Create 2v2 room'
                    : 'Create classic room'}
          </RankUpPrimaryButton>

          <RankUpSecondaryButton onClick={() => setStep('choose')} className="w-full text-center">
            Back
          </RankUpSecondaryButton>
        </div>
      ) : null}
    </RankUpPageWrap>
  );
}
