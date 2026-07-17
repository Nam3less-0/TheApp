import type { RoundEngine } from '../types';
import SupplyRunPlay from './SupplyRunPlay';

export const SUPPLY_PROJECTS = ['Well', 'Wall', 'Granary'] as const;
export type SupplyProject = (typeof SUPPLY_PROJECTS)[number];

export interface SupplyRunState {
  projects: readonly SupplyProject[];
  fundingNeeded: number;
  tokensPerPlayer: number;
}

export const supplyRunEngine: RoundEngine<SupplyRunState> = {
  id: 'supply-run',
  title: 'Supply Run',
  tagline: 'Say where it\u2019s going. Send it wherever you like.',
  accent: '#C9A44A',
  glyph: '📦',
  manual: {
    premise:
      'Three projects need funding: the Well, the Wall, the Granary. Everyone has 3 tokens to split between them.',
    builderGoal: 'Get all three projects funded \u2014 each needs at least 3 tokens total.',
    saboteurGoal: 'Say one thing, do another. Starve at least one project of funding.',
    howToPlay: [
      'Out loud, everyone states which project they plan to support \u2014 this is public, on the honour system.',
      'Then, privately and in turn, everyone actually allocates their 3 tokens however they like.',
      'Allocations are revealed together at the end \u2014 compare them to what was promised.',
    ],
  },
  createRound: () => ({
    projects: SUPPLY_PROJECTS,
    fundingNeeded: 3,
    tokensPerPlayer: 3,
  }),
  briefing: (playerId, _roundState, saboteurId) => {
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: 'You have no special information',
        detail: 'Your only tool is persuasion. Pledge convincingly, then allocate to starve a project.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'Fund all three projects',
      detail: 'Keep your word. Watch whether everyone else keeps theirs.',
    };
  },
  Play: SupplyRunPlay,
};
