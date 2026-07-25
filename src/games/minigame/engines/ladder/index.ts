import type { MinigameEngine } from '../../types';
import LadderPlay from './LadderPlay';

export const ladderEngine: MinigameEngine = {
  id: 'ladder',
  title: 'The Ladder',
  tagline: 'Ten cards, ten prizes, no second chances.',
  accent: '#C9A44A',
  glyph: '🪜',
  manual: {
    premise:
      'Everyone holds the same hand: cards 1 through 10. Ten prizes come out one at a time, worth between 1 and 5 points. Each round everyone secretly plays one card and the highest takes the prize.',
    howToPlay: [
      'Free-for-all \u2014 no teams, everyone plays for themselves.',
      'Each round, one prize is revealed. You can also see the next two prizes coming.',
      'Everyone plays one card in secret (pass the iPad round), then all four flip at once.',
      'Highest card takes the prize. Spent cards are gone permanently.',
      'If two or more players tie on the highest card, nobody wins it \u2014 and those cards are still spent.',
      'Every player\u2019s remaining cards are public, so you always know exactly what everyone has left.',
    ],
    scoring: [
      'Most prize points after 10 rounds: +5 (or +3 each if tied for first).',
      'Runner-up: +2.',
    ],
  },
  Play: LadderPlay,
};
