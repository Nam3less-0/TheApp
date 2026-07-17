import { useState } from 'react';
import { useCodeword } from '../context';
import CodewordPanel, { CodewordPageWrap } from './CodewordPanel';
import ErrorPanel from './ErrorPanel';

export default function CodewordSetupScreen() {
  const { supabaseReady, syncError, connecting, createGame, joinGame, playLocally } =
    useCodeword();
  const [teamName, setTeamName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');

  const canSubmit =
    teamName.trim().length > 0 && (mode === 'create' || roomCode.trim().length === 4);

  async function handleSubmit() {
    if (!canSubmit || !supabaseReady) return;
    if (mode === 'create') {
      await createGame(teamName.trim());
    } else {
      await joinGame(roomCode.trim(), teamName.trim());
    }
  }

  return (
    <CodewordPageWrap>
      <header className="mb-8">
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Codeword
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-text-mid">
          Two teams, two devices. Create a room or join with a code — each team keeps their
          codeword card secret on their own phone.
        </p>
      </header>

      {!supabaseReady && (
        <ErrorPanel message="Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server." />
      )}

      {syncError && supabaseReady && (
        <ErrorPanel
          message={syncError}
          onRetry={canSubmit ? handleSubmit : undefined}
        />
      )}

      <div className="flex flex-col gap-6">
        <CodewordPanel>
          <p className="mb-4 font-body text-sm font-bold text-text-hi">Your team name</p>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Red Team"
            maxLength={24}
            className="w-full rounded-xl border border-line bg-deep px-4 py-3 font-body text-[15px] text-text-hi outline-none focus-visible:border-copper focus-visible:ring-1 focus-visible:ring-copper"
          />
        </CodewordPanel>

        <CodewordPanel>
          <p className="mb-4 font-body text-sm font-bold text-text-hi">Room</p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            {(
              [
                { id: 'create' as const, label: 'Create room', hint: 'Get a code for the other team' },
                { id: 'join' as const, label: 'Join room', hint: 'Enter a 4-letter code' },
              ] as const
            ).map((entry) => {
              const selected = mode === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setMode(entry.id)}
                  className={`rounded-xl border bg-surface p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper ${
                    selected
                      ? 'border-copper shadow-[0_0_0_1px_#C99A7A_inset]'
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
              onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="ABCD"
              maxLength={4}
              className="mb-4 w-full rounded-xl border border-line bg-deep px-4 py-3 text-center font-mono text-xl tracking-[0.3em] text-text-hi outline-none focus-visible:border-copper focus-visible:ring-1 focus-visible:ring-copper"
            />
          )}

          <button
            type="button"
            disabled={!canSubmit || !supabaseReady || connecting}
            onClick={handleSubmit}
            className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
            style={{
              background: 'linear-gradient(180deg, #E2C0A8, #C99A7A 55%, #A87C5E)',
            }}
          >
            {connecting ? 'Connecting…' : mode === 'create' ? 'Create room' : 'Join room'}
          </button>
        </CodewordPanel>

        <button
          type="button"
          onClick={playLocally}
          className="font-mono text-[11px] text-text-low underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          Pass &amp; play on one device instead
        </button>
      </div>
    </CodewordPageWrap>
  );
}
