import { useState } from 'react';
import FloatingTimer from './FloatingTimer';
import FloatingDice from './FloatingDice';
import FloatingSoundboard from './FloatingSoundboard';

function MenuRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-deep px-3 py-2.5 text-left transition-colors hover:border-line-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
    >
      <span className="text-base" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1 font-body text-[13px] font-semibold text-text-hi">{label}</span>
      <span
        className={`font-mono text-[10px] uppercase tracking-wider ${
          active ? 'text-good' : 'text-text-low'
        }`}
      >
        {active ? 'On' : 'Add'}
      </span>
    </button>
  );
}

/**
 * Persistent top-right tools menu available on every game screen. Lets players
 * pop out a draggable countdown timer or a dice roller at any time.
 */
export default function GameTools() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Game tools"
        aria-expanded={menuOpen}
        className="fixed right-2.5 top-2 z-[60] flex h-9 w-9 items-center justify-center rounded-xl border border-line-bright bg-surface/90 text-text-hi shadow-[0_4px_14px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-steel-blue/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          {menuOpen ? (
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[58]"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed right-2.5 top-12 z-[59] w-56 rounded-2xl border border-line-bright bg-surface/95 p-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <p className="px-2 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-low">
              Tools
            </p>
            <div className="flex flex-col gap-1.5">
              <MenuRow
                icon="⏱"
                label="Timer"
                active={showTimer}
                onClick={() => {
                  setShowTimer((v) => !v);
                  setMenuOpen(false);
                }}
              />
              <MenuRow
                icon="🎲"
                label="Dice"
                active={showDice}
                onClick={() => {
                  setShowDice((v) => !v);
                  setMenuOpen(false);
                }}
              />
              <MenuRow
                icon="🔊"
                label="Soundboard"
                active={showSoundboard}
                onClick={() => {
                  setShowSoundboard((v) => !v);
                  setMenuOpen(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {showTimer && <FloatingTimer onClose={() => setShowTimer(false)} />}
      {showDice && <FloatingDice onClose={() => setShowDice(false)} />}
      {showSoundboard && <FloatingSoundboard onClose={() => setShowSoundboard(false)} />}
    </>
  );
}
