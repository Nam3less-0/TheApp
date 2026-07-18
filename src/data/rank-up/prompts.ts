import { ITEM_PROMPT_DEFS } from './prompt-bank/items';
import { PLAYER_PROMPT_TEXTS } from './prompt-bank/players';

export type RankPromptType = 'players' | 'items';

export interface RankPromptPreset {
  id: string;
  type: RankPromptType;
  prompt: string;
  /** Default items for item-type prompts (full pool before draw-time trim) */
  items?: string[];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick 4–6 items from a pool (pool should have at least 4 entries). */
export function resolveItemOptions(pool: string[]): string[] {
  const cleaned = pool.map((item) => item.trim()).filter((item) => item.length > 0);
  if (cleaned.length <= 4) return cleaned;

  const maxCount = Math.min(6, cleaned.length);
  const count = 4 + Math.floor(Math.random() * (maxCount - 3));
  return shuffle(cleaned).slice(0, count);
}

export const RANK_PROMPT_PRESETS: RankPromptPreset[] = [
  ...PLAYER_PROMPT_TEXTS.map((prompt, index) => ({
    id: `p${index + 1}`,
    type: 'players' as const,
    prompt,
  })),
  ...ITEM_PROMPT_DEFS.map((def, index) => ({
    id: `i${index + 1}`,
    type: 'items' as const,
    prompt: def.prompt,
    items: [...def.items],
  })),
];

/** @deprecated use RANK_PROMPT_PRESETS */
export const PLAYER_PROMPT_SUGGESTIONS = RANK_PROMPT_PRESETS.filter((p) => p.type === 'players').map(
  (p) => p.prompt,
);

/** @deprecated use RANK_PROMPT_PRESETS */
export const ITEM_PROMPT_SUGGESTIONS = RANK_PROMPT_PRESETS.filter((p) => p.type === 'items').map(
  (p) => p.prompt,
);

export function presetsForType(type: RankPromptType): RankPromptPreset[] {
  return RANK_PROMPT_PRESETS.filter((preset) => preset.type === type);
}

/** Draw any question type from the combined pool. */
export function drawPromptPreset(excludeId?: string): RankPromptPreset {
  const pool = RANK_PROMPT_PRESETS.filter((preset) => preset.id !== excludeId);
  const source = pool.length > 0 ? pool : RANK_PROMPT_PRESETS;
  const picked = source[Math.floor(Math.random() * source.length)]!;

  if (picked.type === 'items' && picked.items?.length) {
    return { ...picked, items: resolveItemOptions(picked.items) };
  }

  return picked;
}

export function presetToReelItem(preset: RankPromptPreset) {
  return {
    id: preset.id,
    text: preset.prompt,
    tag: preset.type === 'players' ? 'Player rank' : 'Item rank',
  };
}

export function optionLabelsForPreset(
  preset: RankPromptPreset,
  playerNames: string[],
): string[] {
  if (preset.type === 'players') {
    return playerNames.filter((name) => name.trim().length > 0);
  }
  return (preset.items ?? []).filter((item) => item.trim().length > 0);
}
