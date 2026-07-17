import type { CategoryGroupId } from '../../data/categories/groups';

export type RankTier = 'elite' | 'high' | 'mid' | 'base';

export function getRankTier(rank: number): RankTier {
  if (rank <= 10) return 'elite';
  if (rank <= 25) return 'high';
  if (rank <= 50) return 'mid';
  return 'base';
}

export const RANK_TIER_LABEL: Record<RankTier, string> = {
  elite: 'Top 10',
  high: 'Top 25',
  mid: 'Top 50',
  base: '',
};

export const RANK_TIER_STYLES: Record<
  RankTier,
  { badge: string; text: string; glow?: string }
> = {
  elite: {
    badge: 'border-gold/50 bg-gold/15 text-gold-bright',
    text: 'text-gold-bright',
    glow: 'shadow-[0_0_12px_-2px_rgba(201,164,74,0.35)]',
  },
  high: {
    badge: 'border-steel-blue/50 bg-steel-blue/15 text-steel-blue',
    text: 'text-steel-blue',
    glow: 'shadow-[0_0_10px_-2px_rgba(111,168,220,0.3)]',
  },
  mid: {
    badge: 'border-pewter/40 bg-pewter/10 text-silver',
    text: 'text-silver',
  },
  base: {
    badge: 'border-line bg-surface/80 text-text-mid',
    text: 'text-text-mid',
  },
};

const AVATAR_GRADIENTS: [string, string][] = [
  ['#6FA8DC', '#3D7AAF'],
  ['#C9A44A', '#8A6E28'],
  ['#7ED9A4', '#3D9A6A'],
  ['#C99A7A', '#8A5A3A'],
  ['#9BC53D', '#5A7A1A'],
  ['#E07A5F', '#A04030'],
  ['#B8B0BE', '#6A6270'],
  ['#D6294A', '#8A1830'],
];

export function getAvatarGradient(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]!;
}

export const GROUP_ACCENTS: Record<CategoryGroupId, { from: string; to: string; label: string }> = {
  'film-tv': { from: '#C2533B', to: '#7A3526', label: 'Film & TV' },
  music: { from: '#9BC53D', to: '#4A5A1A', label: 'Music' },
  gaming: { from: '#6FA8DC', to: '#3D7AAF', label: 'Gaming' },
  anime: { from: '#D6294A', to: '#8A1830', label: 'Anime' },
  comics: { from: '#C9A44A', to: '#7A6228', label: 'Comics' },
  'pop-culture': { from: '#E07A5F', to: '#A04030', label: 'Pop culture' },
  'food-drink': { from: '#C99A7A', to: '#8A5A3A', label: 'Food & drink' },
  sports: { from: '#7ED9A4', to: '#3D9A6A', label: 'Sports' },
  world: { from: '#6FA8DC', to: '#2A5080', label: 'World' },
  knowledge: { from: '#B8B0BE', to: '#6A6270', label: 'Knowledge' },
  lifestyle: { from: '#C9A44A', to: '#6A5020', label: 'Lifestyle' },
};
