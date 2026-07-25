import { shuffle } from '../../utils';
import type { Player } from '../../types';

export type CrateRole = 'SABOTEUR' | 'BIRDSEYE' | 'SURVEYOR' | 'INFLUENCER';

export const CRATE_LABELS = ['A', 'B', 'C', 'D', 'E'] as const;

export interface CratesRound {
  /** Crate labels still in play this round. */
  crates: string[];
  /** The single rigged crate. */
  riggedCrate: string;
  /** Two safe crates shown to Birdseye (round 1 only). */
  birdseyeSafe: string[];
  /** One safe crate shown to Surveyor. */
  surveyorSafe: string;
}

export interface CratesSetup {
  roles: Record<string, CrateRole>;
  riggedCrate: string;
  /** Round 1 uses all 5 crates. */
  round1: CratesRound;
}

/**
 * Roles are dealt once and persist across both rounds, so credibility earned
 * in round 1 carries forward — that's the whole point of the two-round arc.
 */
export function createCratesSetup(players: Player[]): CratesSetup {
  const shuffledPlayers = shuffle(players.map((p) => p.id));
  const roleOrder: CrateRole[] = ['SABOTEUR', 'BIRDSEYE', 'SURVEYOR', 'INFLUENCER'];
  const roles: Record<string, CrateRole> = {};
  shuffledPlayers.forEach((id, i) => {
    roles[id] = roleOrder[i];
  });

  const crates = [...CRATE_LABELS];
  const riggedCrate = crates[Math.floor(Math.random() * crates.length)];
  const safeCrates = crates.filter((c) => c !== riggedCrate);

  return {
    roles,
    riggedCrate,
    round1: {
      crates,
      riggedCrate,
      // Birdseye learns two genuinely safe crates.
      birdseyeSafe: shuffle(safeCrates).slice(0, 2),
      // Surveyor's single crate is drawn independently from the same safe pool,
      // so it may or may not overlap with what Birdseye saw. Overlap makes the
      // round harder; no overlap gives builders more to work with.
      surveyorSafe: safeCrates[Math.floor(Math.random() * safeCrates.length)],
    },
  };
}

/**
 * Round 2 runs on the crates that remain after a wrong round-1 guess.
 * Birdseye gets no fresh reading — only the Surveyor gets a new clue, so
 * elimination can never fully solve it and round-1 credibility still matters.
 */
export function createRound2(setup: CratesSetup, eliminatedCrate: string): CratesRound {
  const crates = setup.round1.crates.filter((c) => c !== eliminatedCrate);
  const safeCrates = crates.filter((c) => c !== setup.riggedCrate);
  return {
    crates,
    riggedCrate: setup.riggedCrate,
    birdseyeSafe: [],
    surveyorSafe: safeCrates[Math.floor(Math.random() * safeCrates.length)],
  };
}

export const ROLE_LABEL: Record<CrateRole, string> = {
  SABOTEUR: 'Saboteur',
  BIRDSEYE: 'Birdseye',
  SURVEYOR: 'Surveyor',
  INFLUENCER: 'Influencer',
};

export const ROLE_ACCENT: Record<CrateRole, string> = {
  SABOTEUR: '#E8A33D',
  BIRDSEYE: '#6FA8DC',
  SURVEYOR: '#9BC53D',
  INFLUENCER: '#B36FD9',
};

export function roleBriefing(role: CrateRole, round: CratesRound): { headline: string; detail: string } {
  switch (role) {
    case 'SABOTEUR':
      return {
        headline: `Crate ${round.riggedCrate} is rigged`,
        detail: 'Keep the group away from it. If they open any safe crate, you win.',
      };
    case 'BIRDSEYE':
      return round.birdseyeSafe.length > 0
        ? {
            headline: `Crates ${round.birdseyeSafe.join(' and ')} are safe`,
            detail: 'Two confirmed safe. Share carefully — the Saboteur is listening.',
          }
        : {
            headline: 'No fresh reading this round',
            detail: 'You only have what you learned in round 1. Make it count.',
          };
    case 'SURVEYOR':
      return {
        headline: `Crate ${round.surveyorSafe} is safe`,
        detail: 'One confirmed safe crate. It may overlap with what Birdseye saw.',
      };
    case 'INFLUENCER':
      return {
        headline: 'You know nothing about the crates',
        detail: 'After the vote you may secretly swap the chosen crate with another.',
      };
  }
}
