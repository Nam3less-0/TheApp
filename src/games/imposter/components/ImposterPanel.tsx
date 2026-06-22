import type { ReactNode } from 'react';

interface ImposterPanelProps {
  children: ReactNode;
  className?: string;
}

export default function ImposterPanel({
  children,
  className = '',
}: ImposterPanelProps) {
  return (
    <div
      className={`rounded-[16px] border border-line p-4 sm:p-[18px] ${className}`}
      style={{ background: 'linear-gradient(165deg, #222428, #1A1C20 75%)' }}
    >
      {children}
    </div>
  );
}

export function ImposterPageWrap({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[560px] px-4 py-6 sm:px-5 sm:py-7">{children}</div>
  );
}
