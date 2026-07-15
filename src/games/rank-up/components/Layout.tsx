import type { ReactNode } from 'react';

interface RankUpPanelProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export default function RankUpPanel({
  children,
  className = '',
  compact = false,
}: RankUpPanelProps) {
  return (
    <div
      className={`rounded-[18px] border border-line ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-[26px]'
      } ${className}`}
      style={{
        background: 'linear-gradient(165deg, #242228, #1C1A20 75%)',
      }}
    >
      {children}
    </div>
  );
}

export function RankUpPageWrap({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'display';
}) {
  if (variant === 'display') {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-49px)] max-w-[720px] flex-col justify-center px-4 py-8 sm:px-6">
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 sm:py-10">
      {children}
    </div>
  );
}

export function RankUpSectionHeading({
  title,
  description,
  className = '',
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="font-body text-sm font-bold text-text-hi">{title}</h2>
      {description ? (
        <p className="mt-1 font-body text-[13px] leading-snug text-text-mid">{description}</p>
      ) : null}
    </div>
  );
}

export function RankUpPrimaryButton({
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
      className={`w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #E8E4EC, #B8B0BE 50%, #7A7280)',
      }}
    >
      {children}
    </button>
  );
}

export function RankUpSecondaryButton({
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
      className={`rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
