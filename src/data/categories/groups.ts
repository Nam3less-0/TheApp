export type CategoryGroupId =
  | 'film-tv'
  | 'music'
  | 'gaming'
  | 'anime'
  | 'comics'
  | 'pop-culture'
  | 'food-drink'
  | 'sports'
  | 'world'
  | 'knowledge'
  | 'lifestyle';

export interface CategoryGroup {
  id: CategoryGroupId;
  label: string;
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: 'film-tv', label: 'Film & TV' },
  { id: 'music', label: 'Music' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'anime', label: 'Anime' },
  { id: 'comics', label: 'Comics' },
  { id: 'pop-culture', label: 'Pop culture' },
  { id: 'food-drink', label: 'Food & drink' },
  { id: 'sports', label: 'Sports' },
  { id: 'world', label: 'World & places' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

const CATEGORY_GROUP_BY_ID: Record<string, CategoryGroupId> = {
  'most-popular-anime': 'anime',
  'best-selling-video-games': 'gaming',
  'most-streamed-songs': 'music',
  'highest-grossing-films': 'film-tv',
  'most-popular-tv-shows': 'film-tv',
  'highest-grossing-artists': 'music',
  'most-populous-cities': 'world',
  'most-popular-pokemon': 'gaming',
  'most-famous-landmarks': 'world',
  'most-popular-superheroes': 'comics',
  'best-selling-books': 'knowledge',
  'iconic-food-brands': 'food-drink',
  'greatest-athletes': 'sports',
  'most-popular-board-games': 'gaming',
  'famous-car-brands': 'lifestyle',
  'most-famous-paintings': 'knowledge',
  'most-popular-dog-breeds': 'lifestyle',
  'famous-historical-figures': 'knowledge',
  'most-popular-fast-food': 'food-drink',
  'famous-movie-franchises': 'film-tv',
  'most-populous-countries': 'world',
  'famous-fashion-brands': 'lifestyle',
  'most-popular-cat-breeds': 'lifestyle',
  'iconic-video-game-characters': 'gaming',
  'famous-classical-composers': 'music',
  'most-popular-k-pop-groups': 'music',
  'famous-inventions': 'knowledge',
  'most-popular-football-clubs': 'sports',
  'famous-mythological-figures': 'knowledge',
  'most-popular-candy-snacks': 'food-drink',
  'famous-skyscrapers': 'world',
  'most-popular-youtubers': 'pop-culture',
  'famous-scientists': 'knowledge',
  'most-popular-theme-parks': 'world',
  'famous-disney-characters': 'film-tv',
  'famous-natural-wonders': 'world',
  'most-popular-mobile-apps': 'pop-culture',
  'famous-philosophers': 'knowledge',
  'most-popular-cocktails': 'food-drink',
  'famous-space-missions': 'knowledge',
  'iconic-2000s-2010s-tv': 'film-tv',
  'viral-internet-memes': 'pop-culture',
  'beloved-childhood-cartoons': 'pop-culture',
  'iconic-sneakers': 'pop-culture',
  'famous-reality-tv': 'film-tv',
  'anime-that-went-viral': 'anime',
  'popular-esports-games': 'gaming',
  'viral-tiktok-trends': 'pop-culture',
  'iconic-rom-coms': 'film-tv',
  'cult-classic-movies': 'film-tv',
  'most-iconic-marvel-heroes': 'comics',
  'most-iconic-dc-heroes': 'comics',
  'greatest-marvel-villains': 'comics',
  'greatest-dc-villains': 'comics',
  'iconic-superhero-teams': 'comics',
  'famous-x-men-characters': 'comics',
  'famous-comic-storylines': 'comics',
  'iconic-comic-artifacts': 'comics',
  'famous-comic-creators': 'comics',
  'iconic-comic-locations': 'comics',
};

export function getCategoryGroupId(categoryId: string): CategoryGroupId {
  return CATEGORY_GROUP_BY_ID[categoryId] ?? 'knowledge';
}

export function getCategoryGroupLabel(categoryId: string): string {
  const groupId = getCategoryGroupId(categoryId);
  return CATEGORY_GROUPS.find((g) => g.id === groupId)?.label ?? 'Other';
}
