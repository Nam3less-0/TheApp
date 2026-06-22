import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChromeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function ChromeButton({
  children,
  className = '',
  disabled,
  ...props
}: ChromeButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 font-body text-sm font-semibold text-void transition-[transform,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40 motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #F2F4F8 0%, #8B8F99 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.35)',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
