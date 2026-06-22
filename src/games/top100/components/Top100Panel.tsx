import type { ReactNode } from 'react';

interface Top100PanelProps {
  children: ReactNode;
  className?: string;
}

export default function Top100Panel({ children, className = '' }: Top100PanelProps) {
  return (
    <div
      className={`rounded-[18px] border border-line p-[26px] ${className}`}
      style={{
        background: 'linear-gradient(165deg, #222428, #1A1C20 75%)',
      }}
    >
      {children}
    </div>
  );
}

export function Top100PageWrap({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-[50px]">{children}</div>
  );
}
