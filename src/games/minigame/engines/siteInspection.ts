import type { RoundEngine } from '../types';
import SiteInspectionPlay from './SiteInspectionPlay';
import { pickRandom } from '../utils';

export interface MaterialOrder {
  id: number;
  label: string;
  trueStatus: 'sound' | 'compromised';
}

export interface SiteInspectionState {
  orders: MaterialOrder[];
}

const ORDER_LABELS = ['Steel beams', 'Concrete mix', 'Scaffolding rig'];

export const siteInspectionEngine: RoundEngine<SiteInspectionState> = {
  id: 'site-inspection',
  title: 'Site Inspection',
  tagline: 'Three orders. Three votes. One inspector who already knows.',
  accent: '#6FA8DC',
  glyph: '🔍',
  manual: {
    premise: 'Three material orders arrived. Each is either sound or quietly compromised.',
    builderGoal: 'Correctly call at least 2 of the 3 orders.',
    saboteurGoal: 'You privately know the truth on all three \u2014 mislead the vote on at least 2.',
    howToPlay: [
      'For each order, the group discusses openly, then secretly votes Approve or Reject.',
      'Majority decides the call for that order. A tie is broken by the Saboteur\u2019s own vote.',
      'Repeat for all three orders, then the results are tallied.',
    ],
  },
  createRound: () => ({
    orders: ORDER_LABELS.map((label, i) => ({
      id: i,
      label,
      trueStatus: pickRandom(['sound', 'compromised'] as const),
    })),
  }),
  briefing: (playerId, roundState, saboteurId) => {
    if (playerId === saboteurId) {
      const lines = roundState.orders
        .map((o) => `${o.label}: ${o.trueStatus === 'sound' ? 'Sound' : 'Compromised'}`)
        .join(' \u00b7 ');
      return {
        role: 'SABOTEUR',
        headline: 'You know the truth on all three',
        detail: lines,
      };
    }
    return {
      role: 'BUILDER',
      headline: 'You don\u2019t know which orders are safe',
      detail: 'Trust the discussion. Vote what you believe.',
    };
  },
  Play: SiteInspectionPlay,
};
