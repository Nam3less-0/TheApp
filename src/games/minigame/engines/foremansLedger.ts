import type { RoundEngine } from '../types';
import ForemansLedgerPlay from './ForemansLedgerPlay';

export interface ForemansLedgerState {
  proposal: string;
}

const PROPOSALS = [
  'Approve this month\u2019s material order?',
  'Sign off on the revised timeline?',
  'Release payment to the crane crew?',
];

export const foremansLedgerEngine: RoundEngine<ForemansLedgerState> = {
  id: 'foremans-ledger',
  title: 'The Foreman\u2019s Ledger',
  tagline: 'One question. Four secret ballots. No edge for anyone.',
  accent: '#8B8F99',
  glyph: '📋',
  manual: {
    premise: 'A single proposal needs a ledger sign-off. Everyone votes anonymously and secretly.',
    builderGoal: 'Land a unanimous result \u2014 4\u20130 either way.',
    saboteurGoal: 'You get no hidden information this round. Just read the room and vote to split it.',
    howToPlay: [
      'Everyone secretly votes Yes or No, one at a time, phone passed around.',
      'The result is tallied once everyone has voted.',
      'Unanimous (4\u20130) means the crew is aligned. Anything split means doubt got in.',
    ],
  },
  createRound: () => ({ proposal: PROPOSALS[Math.floor(Math.random() * PROPOSALS.length)] }),
  briefing: (playerId, _roundState, saboteurId) => {
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: 'No hidden information this time',
        detail: 'Your only tool is a read on the room. Vote to break unanimity.',
      };
    }
    return {
      role: 'BUILDER',
      headline: 'Vote your honest call',
      detail: 'Try to land on the same answer as everyone else.',
    };
  },
  Play: ForemansLedgerPlay,
};
