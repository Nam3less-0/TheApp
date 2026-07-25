import type { MinigameEngine } from '../../types';
import SplitLinePlay from './SplitLinePlay';

export const splitLineEngine: MinigameEngine = {
  id: 'split-line',
  title: 'Split the Line',
  tagline: 'Two on two. No talking. Read your partner.',
  accent: '#6FA8DC',
  glyph: '⚔️',
  manual: {
    premise:
      'Five contested zones worth 1, 1, 2, 2 and 3 points. Nine points on the table, so five wins the battle. Teams are drawn at random and you place tokens one at a time, out in the open, alternating sides.',
    howToPlay: [
      'NO TALKING \u2014 not to your partner, not to anyone. Their placements are the only signal you get.',
      'Teams alternate placing a single token at a time. Everything is visible to everyone.',
      'Each team has 12 tokens; the team going first gets 13 to offset losing the last word.',
      'A zone goes to whoever has more tokens on it. Equal tokens = nobody scores it.',
      'Overflow is wasted \u2014 you only need one more token than the other side, so stacking the 3-point zone is usually a trap.',
      'Best of three battles. Zone values reshuffle every battle and the starting team alternates.',
    ],
    scoring: [
      'Winning team: +4 each.',
      'Drawn series: +2 each.',
    ],
  },
  Play: SplitLinePlay,
};
