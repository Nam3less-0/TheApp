import { Link } from 'react-router-dom';

function LogoMark() {
  return (
    <div
      className="relative h-8 w-8 shrink-0 rounded-lg"
      style={{
        background: 'linear-gradient(145deg, #F2F4F8 0%, #8B8F99 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.35)',
      }}
    >
      <div className="absolute inset-[3px] rounded-[5px] bg-void" />
    </div>
  );
}

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/70 backdrop-blur-[16px]">
      <nav
        className="mx-auto flex max-w-6xl items-center px-5 py-4 md:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void"
        >
          <LogoMark />
          <span className="font-display text-lg font-extrabold tracking-tight text-text-hi">
            TheApp
          </span>
        </Link>
      </nav>
    </header>
  );
}
