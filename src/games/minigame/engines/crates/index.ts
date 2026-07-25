import type { MinigameEngine } from '../../types';
import CratesPlay from './CratesPlay';

export const cratesEngine: MinigameEngine = {
  id: 'crates',
  title: 'Crates',
  tagline: 'Five crates. One rigged. Two attempts.',
  accent: '#B39DFF',
  glyph: '📦',
  manual: {
    premise:
      'Five crates sit on the dock and exactly one is rigged. The crew has to point at the rigged one — not avoid it. Three of you hold real information; one of you is lying about it.',
    howToPlay: [
      'Roles are dealt privately: Saboteur (knows the rigged crate), Birdseye (knows TWO safe crates), Surveyor (knows ONE safe crate), Influencer (knows nothing, holds a secret swap).',
      'Each player gets 10 uninterrupted seconds to say whatever they want, then 3 minutes of open discussion.',
      'Everyone secretly votes for the rigged crate AND names who they think the Saboteur is.',
      'The Influencer privately sees the group\u2019s choice and may secretly swap it for a different crate.',
      'Guess right and it ends. Guess wrong, that crate is proven safe and removed, and you get a second round on the remaining four \u2014 with only a fresh Surveyor reading to help.',
    ],
    scoring: [
      'Rigged crate found in round 1: +4 to every non-Saboteur.',
      'Found in round 2: +2 to every non-Saboteur.',
      'Saboteur survives both rounds: +6 to the Saboteur.',
      'Correctly naming the Saboteur in your secret vote: +1, win or lose.',
    ],
  },
  Play: CratesPlay,
};
