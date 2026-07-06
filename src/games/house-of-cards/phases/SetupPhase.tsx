import { useState } from 'react';
import { useHouseOfCards } from '../context';
import {
  HocPageWrap,
  HocPanel,
  primaryButtonClass,
  primaryButtonStyle,
} from '../components/Layout';

export default function SetupPhase() {
  const { dispatch } = useHouseOfCards();
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');

  const canStart = teamAName.trim().length > 0 && teamBName.trim().length > 0;

  function handleDeal() {
    if (!canStart) return;
    dispatch({ type: 'START_GAME', teamAName, teamBName });
  }

  const inputClass =
    'min-h-11 w-full rounded-lg border px-3 font-body text-[15px] font-semibold outline-none';
  const inputStyle = {
    borderColor: 'var(--hoc-line-bright)',
    background: 'var(--hoc-onyx)',
    color: 'var(--hoc-ivory)',
  };

  return (
    <HocPageWrap>
      <h1
        className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.5px] sm:text-[30px]"
        style={{ color: 'var(--hoc-ivory)' }}
      >
        New game
      </h1>
      <p className="mb-8 font-body text-sm" style={{ color: 'var(--hoc-ivory-dim)' }}>
        Two teams, one 52-card board. Pick a card, answer its question, and swing the
        score by its value. First past +25 wins; drop below &minus;25 and you&apos;re out.
      </p>

      <HocPanel>
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="hoc-team-a"
              className="mb-1.5 block font-body text-sm font-bold"
              style={{ color: 'var(--hoc-ivory)' }}
            >
              Team A
            </label>
            <input
              id="hoc-team-a"
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="Team A"
              maxLength={24}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label
              htmlFor="hoc-team-b"
              className="mb-1.5 block font-body text-sm font-bold"
              style={{ color: 'var(--hoc-ivory)' }}
            >
              Team B
            </label>
            <input
              id="hoc-team-b"
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="Team B"
              maxLength={24}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        <p
          className="mt-5 font-mono text-[11px] leading-relaxed"
          style={{ color: 'var(--hoc-ivory-dim)' }}
        >
          4 suits, each a random topic drawn fresh every game. Ace = 1 &middot; face
          cards J/Q/K = 11/12/13.
        </p>

        <button
          type="button"
          onClick={handleDeal}
          disabled={!canStart}
          className={`mt-6 ${primaryButtonClass}`}
          style={primaryButtonStyle}
        >
          Deal the Cards
        </button>
      </HocPanel>
    </HocPageWrap>
  );
}
