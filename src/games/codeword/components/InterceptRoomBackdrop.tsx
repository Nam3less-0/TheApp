import type { ReactNode } from 'react';

/** Dark interrogation-room backdrop — concrete, vignette, overhead lamp. */
export default function InterceptRoomBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative -mx-5 px-5 py-5">
      {/* Room atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 85% 55% at 50% -5%, rgba(201,154,122,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 120% 80% at 50% 100%, rgba(0,0,0,0.65) 0%, transparent 55%),
            linear-gradient(180deg, #0E0F12 0%, #0A0B0D 45%, #08090B 100%)
          `,
        }}
      />

      {/* Concrete block texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 32px',
        }}
      />

      {/* Fine grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Overhead lamp cone */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-36 w-[min(100%,420px)] -translate-x-1/2"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(242,244,248,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Caution tape accent — top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-40"
        aria-hidden="true"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            rgba(201,154,122,0.5),
            rgba(201,154,122,0.5) 8px,
            rgba(10,11,13,0.8) 8px,
            rgba(10,11,13,0.8) 16px
          )`,
        }}
      />

      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
