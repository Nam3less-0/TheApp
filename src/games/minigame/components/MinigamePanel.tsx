import type { ReactNode } from 'react';

export const VIOLET = '#8B6FD9';
export const VIOLET_BRIGHT = '#B39DFF';
export const VIOLET_DIM = '#453473';
export const HAZARD = '#E8A33D';

interface MinigamePanelProps {
  children: ReactNode;
  className?: string;
}

export default function MinigamePanel({ children, className = '' }: MinigamePanelProps) {
  return (
    <div
      className={`rounded-[16px] border border-line p-4 sm:p-[18px] ${className}`}
      style={{ background: 'linear-gradient(165deg, #222428, #1A1C20 75%)' }}
    >
      {children}
    </div>
  );
}

export function MinigamePageWrap({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[560px] px-4 py-6 sm:px-5 sm:py-7">{children}</div>;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6FD9] disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: `linear-gradient(180deg, ${VIOLET_BRIGHT}, ${VIOLET} 55%, ${VIOLET_DIM})` }}
    >
      {children}
    </button>
  );
}
