import type { Player, RoundEngine } from '../types';
import ArchitectsVotePlay from './ArchitectsVotePlay';
import { pickRandom } from '../utils';

export interface ArchitectsVoteState {
  proposerId: string;
}

export const architectsVoteEngine: RoundEngine<ArchitectsVoteState> = {
  id: 'architects-vote',
  title: 'The Architect\u2019s Vote',
  tagline: 'Pick the crew. Approve the crew. Hope the crew is clean.',
  accent: '#C9A44A',
  glyph: '🏛️',
  manual: {
    premise: 'One player proposes which 2 of the 4 go on site to finish a critical task.',
    builderGoal: 'Approve a crew that doesn\u2019t include the Saboteur \u2014 or if it does, hope they play it straight.',
    saboteurGoal: 'If you\u2019re picked, you alone decide whether the task quietly fails.',
    howToPlay: [
      'The proposer publicly picks 2 of the 4 players to send on site.',
      'Everyone secretly votes to approve or reject the proposed pair.',
      'If rejected, the project stalls \u2014 the Saboteur wins by default.',
      'If approved, and the Saboteur is one of the two, they alone decide the outcome.',
    ],
  },
  createRound: (players: Player[]) => ({ proposerId: pickRandom(players).id }),
  briefing: (playerId, roundState, saboteurId) => {
    const isProposer = playerId === roundState.proposerId;
    if (playerId === saboteurId) {
      return {
        role: 'SABOTEUR',
        headline: isProposer ? 'You\u2019re proposing the crew' : 'You might get picked',
        detail: 'If you end up on the crew, you alone choose whether the task succeeds or fails.',
      };
    }
    return {
      role: 'BUILDER',
      headline: isProposer ? 'You\u2019re proposing the crew' : 'Vote wisely on the crew',
      detail: 'Think about who you\u2019d trust to actually be on site.',
    };
  },
  Play: ArchitectsVotePlay,
};
