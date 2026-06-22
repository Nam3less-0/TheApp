import { CODEWORD_POOL } from '../../data/codeword-pool';
import type { CodeTriple, TeamCard, TeamCardWords } from './types';

export const WIN_THRESHOLD = 2;
export const LOSE_THRESHOLD = 2;

function slugify(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Draw 4 unique words from the pool and map them to digits 1–4. */
export function drawTeamCard(pool: string[] = CODEWORD_POOL): TeamCard {
  const available = [...pool];
  const picked: string[] = [];

  const drawCount = Math.min(4, available.length);
  for (let i = 0; i < drawCount; i += 1) {
    const index = Math.floor(Math.random() * available.length);
    picked.push(available.splice(index, 1)[0]);
  }

  const words = picked.map((word, i) => ({
    id: `${slugify(word)}-${i}`,
    word,
  })) as TeamCardWords;

  return { words };
}

/** Roll a 3-digit code. Each digit is an independent 1–4 draw; repeats allowed. */
export function generateCode(): CodeTriple {
  const roll = () => Math.floor(Math.random() * 4) + 1;
  return [roll(), roll(), roll()];
}

export function isCompleteGuess(
  guess: (number | null)[],
): guess is CodeTriple {
  return guess.length === 3 && guess.every((d) => d !== null);
}

export function codesMatch(a: CodeTriple, b: CodeTriple): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
