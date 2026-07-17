import type { Player, RoundEngine } from '../types';
import StressTestPlay from './StressTestPlay';
import { pickRandom, shuffle } from '../utils';

export type StressAction = 'reinforce' | 'vent';

export interface StressTurn {
  playerId: string;
  correctAction: StressAction;
}

export interface StressTestState {
  turns: StressTurn[];
}

export const stressTestEngine: RoundEngine<StressTestState> = {
  id: 'stress-test',
  title: 'Structural Stress Test',
  tagline: 'One signal. One shot. No time to think.',
  accent: '#D6294A',
  glyph: '⚡',
  manual: {
    premise: 'The site groans under pressure. Each player gets one signal and 2.5 seconds to react.',
    builderGoal: 'Everyone reacts correctly \u2014 all four, no exceptions.',
    saboteurGoal: 'React wrong on purpose. It just has to look like a slip.',
    howToPlay: [
      'Turn order is randomised. Each player privately sees a signal: Reinforce or Vent.',
      'A countdown starts \u2014 tap the matching action before it runs out.',
      'One wrong tap, or one player too slow, and the structure fails.',
    ],
  },
  createRound: (players: Player[]) => ({
    turns: shuffle(players).map((p: Player) => ({
      playerId: p.id,
      correctAction: pickRandom(['reinforce', 'vent'] as const),
    })),
  }),
  briefing: (playerId, _roundState, saboteurId) => {
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: 'React wrong \u2014 it just has to look rushed',
        detail: 'One bad tap under pressure is easy to explain away.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'React fast and react true',
      detail: 'Watch for your signal, then tap the matching action before time runs out.',
    };
  },
  Play: StressTestPlay,
};
