import type { ReactNode } from 'react';

export function BetPageWrap({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`mx-auto px-4 py-6 sm:px-5 sm:py-7 ${wide ? 'max-w-[960px]' : 'max-w-[560px]'}`}
    >
      {children}
    </div>
  );
}

export function BetPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bet-corner-brackets rounded-[16px] border border-line p-4 sm:p-[18px] ${className}`}
      style={{
        background: 'linear-gradient(165deg, #222428, #1A1C20 75%)',
      }}
    >
      {children}
    </div>
  );
}

export function BetFloatingLabel({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-low opacity-40 sm:left-6">
      {children}
    </span>
  );
}

export function BetGoldButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #EAC870, #C9A44A 55%, #7A6228)',
      }}
    >
      {children}
    </button>
  );
}
