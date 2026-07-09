import { Link } from 'react-router-dom';
import { useJeopardy } from './context';
import GameControls from './components/GameControls';
import SetupScreen from './components/SetupScreen';
import TopicPreviewScreen from './components/TopicPreviewScreen';
import BoardScreen from './components/BoardScreen';
import QuestionScreen from './components/QuestionScreen';
import WagerScreen from './components/WagerScreen';
import FinalJeopardyScreen from './components/FinalJeopardyScreen';
import FinalScreen from './components/FinalScreen';

function JeopardyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div className="border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 py-2.5 pl-5 pr-14">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-steel-blue">Jeopardy</span>
          <GameControls />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function JeopardyGame() {
  const { state } = useJeopardy();

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <SetupScreen />;
      break;
    case 'topic-preview':
      screen = <TopicPreviewScreen />;
      break;
    case 'board':
      screen = <BoardScreen />;
      break;
    case 'wager':
      screen = <WagerScreen />;
      break;
    case 'question':
    case 'answer':
      screen = <QuestionScreen />;
      break;
    case 'final-wager':
    case 'final-clue':
      screen = <FinalJeopardyScreen />;
      break;
    case 'final':
      screen = <FinalScreen />;
      break;
    default:
      screen = null;
  }

  return <JeopardyShell>{screen}</JeopardyShell>;
}
