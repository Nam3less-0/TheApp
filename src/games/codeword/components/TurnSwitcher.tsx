export type PlayMode = 'ours' | 'theirs';

interface TurnSwitcherProps {
  mode: PlayMode;
  onChange: (mode: PlayMode) => void;
  className?: string;
}

const TABS: { id: PlayMode; label: string; hint: string }[] = [
  { id: 'ours', label: 'Our turn', hint: "We're messenger" },
  { id: 'theirs', label: 'Their turn', hint: "We're intercepting" },
];

const BRASS = '#C99A7A';

export default function TurnSwitcher({ mode, onChange, className = '' }: TurnSwitcherProps) {
  return (
    <div
      className={`mb-4 grid grid-cols-2 gap-1.5 rounded-2xl border border-line p-1.5 ${className}`}
      role="tablist"
      aria-label="Whose turn is it"
      style={{
        background: 'linear-gradient(180deg, #1A1C20, #131417)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {TABS.map((tab) => {
        const active = mode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`relative flex min-h-[48px] flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-[box-shadow,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper ${
              active ? 'text-text-hi' : 'text-text-mid hover:text-text-hi'
            }`}
            style={
              active
                ? {
                    background:
                      'linear-gradient(180deg, rgba(201,154,122,0.14), rgba(26,28,32,0.9))',
                    boxShadow: `inset 0 0 0 1px rgba(201,154,122,0.45), inset 0 2px 12px rgba(201,154,122,0.12), 0 1px 0 rgba(255,255,255,0.04)`,
                  }
                : undefined
            }
          >
            {active && (
              <span
                className="pointer-events-none absolute inset-x-3 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${BRASS}, transparent)`,
                }}
                aria-hidden="true"
              />
            )}
            <span className="font-body text-sm font-bold">{tab.label}</span>
            <span
              className={`font-mono text-[10px] uppercase tracking-wider ${
                active ? 'text-copper' : 'text-text-low'
              }`}
            >
              {tab.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
