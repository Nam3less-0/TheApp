import ChromeButton from './ui/ChromeButton';

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-6 pt-6 md:px-8 md:pb-8 md:pt-8">
      <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-mid">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-silver"
          style={{ boxShadow: '0 0 6px rgba(201, 205, 214, 0.5)' }}
          aria-hidden="true"
        />
        A private arcade
      </p>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1
            className="max-w-xl font-display text-[clamp(1.75rem,5vw,2.75rem)] font-black leading-[1.08] tracking-tight"
            style={{
              background: 'linear-gradient(180deg, #F2F4F8 0%, #C9CDD6 55%, #8B8F99 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.45))',
            }}
          >
            Your games.
            <br />
            One shelf.
          </h1>

          <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-text-mid md:text-[15px]">
            A curated hub of browser mini-games — pick a plate and jump in.
          </p>
        </div>

        <ChromeButton
          className="shrink-0 self-start sm:self-auto"
          onClick={() => document.getElementById('shelf')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Browse the shelf
        </ChromeButton>
      </div>
    </section>
  );
}
