import { Routes, Route } from 'react-router-dom';
import Background from './components/Background';
import HubPage from './pages/HubPage';
import GamePage from './pages/GamePage';

export default function App() {
  return (
    <div className="relative z-10 min-h-svh">
      <Background />
      <Routes>
        <Route path="/" element={<HubPage />} />
        <Route path="/play/:gameId" element={<GamePage />} />
      </Routes>
    </div>
  );
}
