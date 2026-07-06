import type { CSSProperties, ReactNode } from 'react';

export function HocPageWrap({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-6 sm:px-6 sm:py-8">{children}</div>
  );
}

export function HocPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 ${className}`}
      style={{
        borderColor: 'var(--hoc-line)',
        background:
          'linear-gradient(150deg, var(--hoc-panel-raised) 0%, var(--hoc-panel) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {children}
    </div>
  );
}

export const primaryButtonStyle: CSSProperties = {
  background: 'linear-gradient(180deg, var(--hoc-crimson-bright) 0%, var(--hoc-crimson) 100%)',
  color: 'var(--hoc-ivory)',
  boxShadow: '0 6px 18px rgba(169,32,58,0.35)',
};

export const primaryButtonClass =
  'w-full rounded-xl border-none px-4 py-4 font-body text-[15px] font-bold transition-[opacity,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:enabled:active:scale-[0.99]';
