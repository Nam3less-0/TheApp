import { Link, useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import GameTools from '../components/gametools/GameTools';
import { getGameById } from '../data/games';
import { Top100Provider } from '../games/top100/context';
import Top100Game from '../games/top100/Top100Game';
import { CodewordProvider } from '../games/codeword/context';
import CodewordGame from '../games/codeword/CodewordGame';
import { ImposterProvider } from '../games/imposter/context';
import ImposterGame from '../games/imposter/ImposterGame';
import { JeopardyProvider } from '../games/jeopardy/context';
import JeopardyGame from '../games/jeopardy/JeopardyGame';
import TheBet from '../games/the-bet/TheBet';
import { ExposedProvider } from '../games/exposed/context';
import ExposedGame from '../games/exposed/ExposedGame';
import { BlitzProvider } from '../games/blitz/context';
import BlitzGame from '../games/blitz/BlitzGame';
import { HouseOfCardsProvider } from '../games/house-of-cards/context';
import HouseOfCardsGame from '../games/house-of-cards/HouseOfCardsGame';
import { RankUpProvider } from '../games/rank-up/context';
import RankUpGame from '../games/rank-up/RankUpGame';
import { MinigameProvider } from '../games/minigame/context';
import MinigameGame from '../games/minigame/MinigameGame';

function renderGame(gameId: string | undefined): React.ReactNode {
  switch (gameId) {
    case 'top-100':
      return (
        <Top100Provider>
          <Top100Game />
        </Top100Provider>
      );
    case 'codeword':
      return (
        <CodewordProvider>
          <CodewordGame />
        </CodewordProvider>
      );
    case 'imposter':
      return (
        <ImposterProvider>
          <ImposterGame />
        </ImposterProvider>
      );
    case 'jeopardy':
      return (
        <JeopardyProvider>
          <JeopardyGame />
        </JeopardyProvider>
      );
    case 'the-bet':
      return <TheBet />;
    case 'exposed':
      return (
        <ExposedProvider>
          <ExposedGame />
        </ExposedProvider>
      );
    case 'blitz':
      return (
        <BlitzProvider>
          <BlitzGame />
        </BlitzProvider>
      );
    case 'house-of-cards':
      return (
        <HouseOfCardsProvider>
          <HouseOfCardsGame />
        </HouseOfCardsProvider>
      );
    case 'rank-up':
      return (
        <RankUpProvider>
          <RankUpGame />
        </RankUpProvider>
      );
    case 'minigame':
      return (
        <MinigameProvider>
          <MinigameGame />
        </MinigameProvider>
      );
    default:
      return null;
  }
}

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = gameId ? getGameById(gameId) : undefined;
  const gameContent = renderGame(gameId);

  if (gameContent) {
    return (
      <>
        {gameContent}
        <GameTools />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto flex min-h-[60svh] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center md:px-8">
        {game ? (
          <>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-text-low">
              {game.id}
            </p>
            <h1 className="mb-4 font-display text-3xl font-bold text-text-hi md:text-4xl">
              {game.title}
            </h1>
          </>
        ) : null}

        <p className="mb-8 font-body text-lg text-text-mid">Game coming soon</p>

        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void"
        >
          ← Back to shelf
        </Link>
      </main>
      <Footer />
    </>
  );
}
