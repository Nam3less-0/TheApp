import type { RoundEngine } from '../types';
import BoxesPlay from './BoxesPlay';
import { pickRandom } from '../utils';

export interface BoxesState {
  passSide: 'left' | 'right';
}

export const boxesEngine: RoundEngine<BoxesState> = {
  id: 'boxes',
  title: 'The Boxes',
  tagline: 'One box is safe. One brings the wall down.',
  accent: '#6FA8DC',
  glyph: '📦',
  manual: {
    premise:
      'Two crates sit on site — Left and Right. One is structurally sound. One is rigged to fail. Nobody can see inside.',
    builderGoal: 'Get the group to open the SAFE crate.',
    saboteurGoal: 'Talk the group into opening the FAILING crate — without anyone clocking it.',
    howToPlay: [
      'The Saboteur is privately shown which crate actually fails.',
      'Everyone discusses openly — the Saboteur must argue without giving themselves away.',
      'Each player then casts a secret vote: Left or Right.',
      'Majority decides which crate opens. A 2–2 tie is broken by the Saboteur\u2019s own vote.',
    ],
  },
  createRound: () => ({ passSide: pickRandom(['left', 'right'] as const) }),
  briefing: (playerId, roundState, saboteurId) => {
    if (playerId === saboteurId) {
      const failSide = roundState.passSide === 'left' ? 'RIGHT' : 'LEFT';
      return {
        role: 'SABOTEUR',
        headline: `The ${failSide} crate fails`,
        detail: 'Steer the vote there — but keep it subtle.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'You don\u2019t know which crate is safe',
      detail: 'Listen closely. Vote for the one you trust.',
    };
  },
  Play: BoxesPlay,
};
