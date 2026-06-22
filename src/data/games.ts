import type { GameEntry } from '../types/game';
import { CodewordIcon, ImposterIcon, JeopardyIcon, Top100Icon } from '../icons/GameIcons';

export const games: GameEntry[] = [
  {
    id: 'top-100',
    title: 'Top 100',
    description: 'Pass-and-play ranked list guessing.',
    metal: 'steel-blue',
    status: 'playable',
    icon: Top100Icon,
  },
  {
    id: 'codeword',
    title: 'Codeword',
    description: 'Two-team hint duel — clue, decode, intercept.',
    metal: 'copper',
    status: 'playable',
    icon: CodewordIcon,
  },
  {
    id: 'imposter',
    title: 'Imposter',
    description: 'Pass-and-play social deduction — spot the odd word out.',
    metal: 'ember',
    status: 'playable',
    icon: ImposterIcon,
  },
  {
    id: 'jeopardy',
    title: 'Jeopardy',
    description: 'Pass-and-play trivia board — pick a tile, beat the clue.',
    metal: 'steel-blue',
    status: 'playable',
    icon: JeopardyIcon,
  },
];

export function getPlayableCount() {
  return games.filter((g) => g.status === 'playable').length;
}

export function getInProgressCount() {
  return games.filter((g) => g.status === 'in-progress').length;
}

export function getGameById(id: string) {
  return games.find((g) => g.id === id);
}
