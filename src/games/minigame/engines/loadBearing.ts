import type { Player, RoundEngine } from '../types';
import LoadBearingPlay from './LoadBearingPlay';
import { randInt, shuffle } from '../utils';

export interface BeamTurn {
  playerId: string;
  naturalRoll: number;
  weakenedRoll: number;
}

export interface LoadBearingState {
  turns: BeamTurn[];
  threshold: number;
}

export const loadBearingEngine: RoundEngine<LoadBearingState> = {
  id: 'load-bearing',
  title: 'Load-Bearing',
  tagline: 'Eight beams. One tower. Somebody\u2019s cutting corners.',
  accent: '#C99A7A',
  glyph: '🏗️',
  manual: {
    premise:
      'The team is raising a tower, one beam at a time. Each beam carries a hidden load rating — only the builder placing it sees the number.',
    builderGoal: 'Keep the tower\u2019s true total load rating at or above 27.',
    saboteurGoal: 'Quietly under-load your own beams to drag the total below 27.',
    howToPlay: [
      'Turn order is randomised. Every player places exactly two beams.',
      'On your turn, you privately see your beam\u2019s rolled strength — say a number out loud if you like, honestly or not.',
      'The Saboteur alone gets a second option each turn: place the true roll, or secretly weaken it.',
      'Beams go up face-down. The true total is only revealed once all eight are placed.',
    ],
  },
  createRound: (players: Player[]) => {
    const order = shuffle(players).map((p) => p.id);
    const turnOrder = [...order, ...order];
    const turns: BeamTurn[] = turnOrder.map((playerId) => {
      const naturalRoll = randInt(1, 6);
      return { playerId, naturalRoll, weakenedRoll: Math.max(1, naturalRoll - 3) };
    });
    return { turns, threshold: 27 };
  },
  briefing: (playerId, _roundState, saboteurId) => {
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: 'You place two beams',
        detail: 'On each of your turns you can secretly weaken the load. Use it wisely \u2014 or not at all.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'You place two beams honestly',
      detail: 'Keep the tower standing. Watch how your teammates place theirs.',
    };
  },
  Play: LoadBearingPlay,
};
