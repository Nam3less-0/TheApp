import type { ReactNode } from 'react';
import { EyeIcon } from './RankUpIcons';

interface GuesserBadgeProps {
  label?: string;
  className?: string;
}

export function GuesserBadge({ label = 'Guesser', className = '' }: GuesserBadgeProps) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-pewter ${className}`}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-pewter/10 text-pewter">
        <EyeIcon className="h-3 w-3" />
      </span>
      {label}
    </p>
  );
}

interface GuesserScreenHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function GuesserScreenHeader({
  eyebrow = 'Read the ranker\'s mind',
  title,
  subtitle,
  children,
}: GuesserScreenHeaderProps) {
  return (
    <header className="mb-6">
      <GuesserBadge label={eyebrow} className="mb-2" />
      <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 font-body text-sm text-text-mid">{subtitle}</p>
      ) : null}
      {children}
    </header>
  );
}
