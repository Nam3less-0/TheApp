import type { Player, RoundEngine } from '../types';
import BlueprintRelayPlay from './BlueprintRelayPlay';
import { shuffle } from '../utils';

export interface BlueprintRelayState {
  chainOrder: string[];
  targetCells: number[];
}

const ORDINALS = ['1st', '2nd', '3rd', '4th'];

export const blueprintRelayEngine: RoundEngine<BlueprintRelayState> = {
  id: 'blueprint-relay',
  title: 'Blueprint Relay',
  tagline: 'One glance. Three whispers. One rebuild.',
  accent: '#8B8F99',
  glyph: '📐',
  manual: {
    premise:
      'A 3\u00d73 site plan flashes to the first player, then gets whispered down the line \u2014 no app, just words \u2014 until the last player has to rebuild it from memory.',
    builderGoal: 'Reconstruct at least 3 of the 4 marked cells correctly.',
    saboteurGoal: 'Distort whatever passes through you \u2014 subtly, or all the way, if you\u2019re the one rebuilding it.',
    howToPlay: [
      'A random chain order is set. Player 1 privately sees the target shape.',
      'Player 1 describes it out loud to Player 2, who relays it to Player 3, who relays it to Player 4.',
      'No app screen shows the shape again until the end \u2014 it\u2019s all verbal from here.',
      'Player 4 taps 4 cells to rebuild what they were told.',
    ],
  },
  createRound: (players: Player[]) => {
    const chainOrder = shuffle(players).map((p) => p.id);
    const cells = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4);
    return { chainOrder, targetCells: cells.sort((a, b) => a - b) };
  },
  briefing: (playerId, roundState, saboteurId) => {
    const position = roundState.chainOrder.indexOf(playerId);
    const ordinal = ORDINALS[position] ?? `${position + 1}th`;
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: `You\u2019re link ${ordinal} in the chain`,
        detail:
          position === roundState.chainOrder.length - 1
            ? 'You do the rebuilding \u2014 you decide exactly what gets built.'
            : 'Whatever you pass on can be a little off. Nobody can check.',
      };
    }
    return {
      role: 'BUILDER',
      headline: `You\u2019re link ${ordinal} in the chain`,
      detail: 'Pass on what you were told as faithfully as you can.',
    };
  },
  Play: BlueprintRelayPlay,
};
