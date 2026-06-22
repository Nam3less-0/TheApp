import type { ReactNode } from 'react';

interface JeopardyPanelProps {
  children: ReactNode;
  className?: string;
}

export default function JeopardyPanel({
  children,
  className = '',
}: JeopardyPanelProps) {
  return (
    <div
      className={`rounded-[18px] border border-line p-[22px] ${className}`}
      style={{ background: 'linear-gradient(165deg, #222428, #1A1C20 75%)' }}
    >
      {children}
    </div>
  );
}

export function JeopardyPageWrap({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[720px] px-[18px] py-9">{children}</div>;
}
