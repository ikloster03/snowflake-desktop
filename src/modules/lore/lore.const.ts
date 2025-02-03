import { Page } from '@/router.type';

export const LORE_PAGE: Page = {
  path: '/lore',
  name: 'lore-page',
  title: 'Lore',
} as const;

export const LORE_WORLD_MAP_PAGE: Page = {
  path: '/lore/world-map',
  name: 'lore-world-map-page',
  title: 'Карта мира',
} as const;

export const LORE_CHARACTER_PAGE: Page = {
  path: '/lore/character',
  name: 'lore-character-page',
  title: 'Персонажи',
} as const;
