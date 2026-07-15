import { useState } from 'react';
import { useRankUp } from '../context';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSectionHeading,
} from './Layout';

export default function SetupScreen() {
  const { local, supabaseReady, createGame, joinGame } = useRankUp();
  const [playerName, setPlayerName] = useState(local.playerName || '');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');

  const canSubmit = playerName.trim().length > 0 && (mode === 'create' || roomCode.trim().length === 4);

  async function handleSubmit() {
    if (!canSubmit) return;
    if (mode === 'create') {
      await createGame(playerName.trim());
    } else {
      await joinGame(roomCode.trim(), playerName.trim());
    }
  }

  return (
    <RankUpPageWrap>
      <header className="mb-8">
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Rank Up
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-text-mid">
          Everyone on their own phone. Create a room or join with a code — the ranker runs each
          round, everyone else guesses and scores themselves.
        </p>
      </header>

      {!supabaseReady && (
        <RankUpPanel compact className="mb-6 border-bad/40">
          <p className="font-body text-sm text-bad">
            Supabase is not configured. Add <code className="font-mono text-[12px]">VITE_SUPABASE_URL</code>{' '}
            and <code className="font-mono text-[12px]">VITE_SUPABASE_ANON_KEY</code> to a{' '}
            <code className="font-mono text-[12px]">.env</code> file, then restart the dev server.
          </p>
        </RankUpPanel>
      )}

      {local.syncError && (
        <RankUpPanel compact className="mb-6 border-bad/40">
          <p className="font-body text-sm text-bad">{local.syncError}</p>
        </RankUpPanel>
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
