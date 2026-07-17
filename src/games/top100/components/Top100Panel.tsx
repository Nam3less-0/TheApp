import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ListIcon } from './Top100Icons';

interface Top100PanelProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  glow?: boolean;
}

export default function Top100Panel({
  children,
  className = '',
  compact = false,
  glow = false,
}: Top100PanelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border border-line ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-[26px]'
      } ${glow ? 'border-steel-blue/30 shadow-[0_0_32px_-8px_rgba(111,168,220,0.25)]' : ''} ${className}`}
      style={{
        background: 'linear-gradient(165deg, #232830 0%, #1A1E24 55%, #16181C 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-blue/25 to-transparent"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export function Top100Frame({
  children,
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[22px] opacity-70 sm:-inset-4"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(111,168,220,0.16) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <Top100Panel compact glow className="relative">
        {(eyebrow || title) && (
          <header className="mb-6 text-center">
            {eyebrow ? (
              <p className="mb-2 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel-blue">
                {icon ?? (
                  <motion.span
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-steel-blue/15 text-steel-blue"
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                  </motion.span>
                )}
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1 className="font-display text-2xl font-extrabold leading-tight text-text-hi sm:text-3xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-2 font-body text-sm text-text-mid">{subtitle}</p>
            ) : null}
          </header>
        )}
        {children}
      </Top100Panel>
    </div>
  );
}

export function Top100PageWrap({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'game';
}) {
  if (variant === 'game') {
    return (
      <div className="flex h-[calc(100svh-53px)] w-full min-h-0 flex-col px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 xl:px-12">
      {children}
    </div>
  );
}

export function Top100SectionHeading({
  title,
  description,
  className = '',
  step,
}: {
  title: string;
  description?: string;
  className?: string;
  step?: number;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        {step !== undefined && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-steel-blue/40 bg-steel-blue/10 font-mono text-[11px] font-bold text-steel-blue">
            {step}
          </span>
        )}
        <h2 className="font-body text-sm font-bold text-text-hi">{title}</h2>
      </div>
      {description ? (
        <p className={`mt-1 font-body text-[13px] leading-snug text-text-mid ${step !== undefined ? 'pl-[34px]' : ''}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Top100PrimaryButton({
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
      className={`group relative w-full overflow-hidden rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-[opacity,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #8FC4F0 0%, #6FA8DC 45%, #4A8BC4 100%)',
        boxShadow: '0 4px 20px -4px rgba(111,168,220,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </button>
  );
}

export function Top100SecondaryButton({
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
      className={`rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-steel-blue/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function RankBadge({
  rank,
  size = 'md',
  className = '',
}: {
  rank: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const tier =
    rank <= 10 ? 'elite' : rank <= 25 ? 'high' : rank <= 50 ? 'mid' : 'base';

  const tierStyles = {
    elite: 'border-gold/45 bg-gold/12 text-gold-bright',
    high: 'border-steel-blue/45 bg-steel-blue/12 text-steel-blue',
    mid: 'border-pewter/35 bg-pewter/8 text-silver',
    base: 'border-line bg-surface/60 text-text-mid',
  };

  const sizeStyles = {
    sm: 'h-6 min-w-[1.5rem] px-1 text-[10px]',
    md: 'h-7 min-w-[1.75rem] px-1.5 text-[11px]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-mono font-bold tabular-nums ${tierStyles[tier]} ${sizeStyles[size]} ${className}`}
    >
      {rank}
    </span>
  );
}
