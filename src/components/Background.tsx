const grainSvg = (baseFrequency: number, octaves: number) =>
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="${octaves}" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>`,
  );

const coarseGrain = `url("data:image/svg+xml,${grainSvg(0.75, 4)}")`;
const fineGrain = `url("data:image/svg+xml,${grainSvg(0.9, 2)}")`;

export default function Background() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base + subtle steel vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(111, 168, 220, 0.07) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 100% 50%, rgba(111, 168, 220, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 45% 35% at 0% 85%, rgba(201, 164, 74, 0.04) 0%, transparent 55%),
            linear-gradient(180deg, #0A0B0D 0%, #131417 48%, #0A0B0D 100%)
          `,
        }}
      />

      {/* Brushed-metal striations */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, transparent, transparent 3px, rgba(255,255,255,0.028) 3px, rgba(255,255,255,0.028) 4px)',
        }}
      />

      {/* Fine cross-hatch mesh */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Coarse film grain */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: coarseGrain,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Fine speckle grain — matches the mockup-style texture layer */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: fineGrain,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
}
