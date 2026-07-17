import type { Player, RoundEngine } from '../types';
import FinalBlueprintPlay from './FinalBlueprintPlay';
import { shuffle } from '../utils';

export interface FinalBlueprintState {
  tileOrder: string[];
}

export const finalBlueprintEngine: RoundEngine<FinalBlueprintState> = {
  id: 'final-blueprint',
  title: 'The Final Blueprint',
  tagline: 'Four tiles. One crack. One guess.',
  accent: '#D6294A',
  glyph: '🏁',
  manual: {
    premise:
      'Everyone seals one tile into the final blueprint, face-down. Builders always seal it Reinforced. The Saboteur always seals it Cracked \u2014 there\u2019s no way to tell from the app alone.',
    builderGoal: 'Everything you\u2019ve read all session comes down to one flip \u2014 correctly identify the Saboteur\u2019s tile.',
    saboteurGoal: 'Seal your tile like everyone else. Stay calm. Let them guess wrong.',
    howToPlay: [
      'Each player privately seals their tile \u2014 the screen looks identical for everyone.',
      'Once all four are in, discuss openly one last time.',
      'The group gets exactly one flip: pick a tile to inspect.',
    ],
  },
  createRound: (players: Player[]) => ({ tileOrder: shuffle(players).map((p) => p.id) }),
  briefing: (playerId, _roundState, saboteurId) => {
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: 'Seal your tile as normal',
        detail: 'It will secretly be Cracked. Nothing about your screen gives it away.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'Seal your tile as normal',
      detail: 'It will secretly be Reinforced. Nothing about your screen gives it away.',
    };
  },
  Play: FinalBlueprintPlay,
};
