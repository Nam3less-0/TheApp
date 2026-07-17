import type { Player, RoundEngine } from '../types';
import WiringPlay from './WiringPlay';
import { shuffle } from '../utils';

export interface WireTurn {
  playerId: string;
  trulyHasPiece: boolean;
}

export interface WiringState {
  turns: WireTurn[];
}

const BAD_LUCK_CHANCE = 0.06;

export const wiringEngine: RoundEngine<WiringState> = {
  id: 'wiring',
  title: 'The Wiring',
  tagline: 'Start to end. Eight hands. One who\u2019s holding out.',
  accent: '#9BC53D',
  glyph: '🔌',
  manual: {
    premise:
      'The crew is running a circuit from Start to End, one connector at a time. Nobody can see anyone else\u2019s hand.',
    builderGoal: 'Get the circuit fully connected \u2014 the crew can survive one missing connector, no more.',
    saboteurGoal:
      'You always secretly have a valid connector on your turn. Skip it anyway to quietly deny the circuit a piece.',
    howToPlay: [
      'Turn order is randomised. Everyone gets two turns.',
      'On your turn you privately learn whether you truly have a valid connector.',
      'You then choose: place it, or skip this turn.',
      'A single skip can be absorbed by the crew improvising \u2014 two or more, and the circuit fails.',
    ],
  },
  createRound: (players: Player[], saboteurId: string) => {
    const order = shuffle(players).map((p) => p.id);
    const turnOrder = [...order, ...order];
    return {
      turns: turnOrder.map((playerId) => ({
        playerId,
        trulyHasPiece: playerId === saboteurId ? true : Math.random() > BAD_LUCK_CHANCE,
      })),
    };
  },
  briefing: (playerId, _roundState, saboteurId) => {
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: 'You always have a valid connector',
        detail: 'On each of your two turns you can place it honestly, or skip and deny the crew a piece.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'Play your hand honestly',
      detail: 'You won\u2019t always have a valid connector \u2014 that\u2019s just bad luck when it happens.',
    };
  },
  Play: WiringPlay,
};
