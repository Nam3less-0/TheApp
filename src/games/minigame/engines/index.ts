import type { MinigameEngine } from '../types';
import { cratesEngine } from './crates';
import { splitLineEngine } from './split-line';
import { ladderEngine } from './ladder';

export const MINIGAMES: MinigameEngine[] = [cratesEngine, splitLineEngine, ladderEngine];

export const TOTAL_GAMES = MINIGAMES.length;
