import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRankUpHost } from '../games/rank-up/host/context';
import HostScreenRouter from '../games/rank-up/host/HostScreenRouter';
import ErrorPanel from '../games/rank-up/components/ErrorPanel';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSectionHeading,
} from '../games/rank-up/components/Layout';

function HostCodeEntryScreen() {
  const { connectToRoom, isConnecting, syncError, supabaseReady, clearError } = useRankUpHost();
  const [roomCode, setRoomCode] = useState('');

  const canSubmit = roomCode.trim().length === 4;

  async function handleSubmit() {
    if (!canSubmit) return;
    clearError();
    await connectToRoom(roomCode.trim());
  }

  return (
    <RankUpPageWrap variant="display">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6FA3C4]">
          Host display mode
        </p>
        <h1 className="mt-2 font-display text-[30px] font-extrabold tracking-[-0.5px] text-text-hi">
          Cast Rank Up to a screen
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-text-mid">
          Join a room read-only to mirror live progress and the reveal comparison grid. This device
          never joins as a player.
        </p>
      </header>

      {!supabaseReady && (
        <ErrorPanel message="Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server." />
      )}

      {syncError ? <ErrorPanel message={syncError} className="mb-4" /> : null}

      <RankUpPanel compact className="max-w-md">
        <RankUpSectionHeading
          title="Room code"
          description="Enter the same 4-letter code shown on the host phone."
          className="mb-4"
        />
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
        onClick={handleSubmit}
        disabled={!canSubmit || !supabaseReady || isConnecting}
        className="mt-6 max-w-md"
      >
        {isConnecting ? 'Connecting…' : 'Connect display'}
      </RankUpPrimaryButton>
    </RankUpPageWrap>
  );
}

function HostShell({ children }: { children: React.ReactNode }) {
  const { roomCode, disconnect } = useRankUpHost();

  return (
    <div className="relative z-[2] min-h-svh rank-up-game-shell">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(155,147,168,0.1) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="relative border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-text-hi">Rank Up — Host Display</span>
          {roomCode ? (
            <button
              type="button"
              onClick={disconnect}
              className="font-mono text-xs text-text-low transition-colors hover:text-text-mid"
            >
              Disconnect
            </button>
          ) : (
            <span className="w-16" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function RankUpHostPageInner() {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const { roomCode, connectToRoom, isConnecting } = useRankUpHost();

  useEffect(() => {
    if (!code || roomCode || isConnecting) return;
    void connectToRoom(code).then(() => {
      // Keep URL stable once connected.
    });
  }, [code, roomCode, connectToRoom, isConnecting]);

  useEffect(() => {
    if (roomCode && !code) {
      navigate(`/play/rank-up/host/${roomCode}`, { replace: true });
    }
  }, [roomCode, code, navigate]);

  if (roomCode) {
    return <HostScreenRouter />;
  }

  return <HostCodeEntryScreen />;
}

export default function RankUpHostPage() {
  return (
    <HostShell>
      <RankUpHostPageInner />
    </HostShell>
  );
}
