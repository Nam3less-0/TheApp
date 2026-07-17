import { ITEM_PROMPT_DEFS } from './prompt-bank/items';
import { PLAYER_PROMPT_TEXTS } from './prompt-bank/players';

export type RankPromptType = 'players' | 'items';

export interface RankPromptPreset {
  id: string;
  type: RankPromptType;
  prompt: string;
  /** Default items for item-type prompts */
  items?: string[];
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

export function drawPromptPreset(type: RankPromptType, excludeId?: string): RankPromptPreset {
  const pool = presetsForType(type).filter((preset) => preset.id !== excludeId);
  const source = pool.length > 0 ? pool : presetsForType(type);
  return source[Math.floor(Math.random() * source.length)]!;
}

export function presetToReelItem(preset: RankPromptPreset) {
  return {
    id: preset.id,
    text: preset.prompt,
    tag: preset.type === 'players' ? 'Player rank' : 'Item rank',
  };
}
