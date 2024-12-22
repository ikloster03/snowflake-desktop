import { Page } from '@/router.type';

export const PROJECTION_PAGE: Page = {
  path: '/projection',
  name: 'projection-page',
  title: 'Projection',
} as const;

export const CHARACTER_MAP_PAGE: Page = {
  path: '/character-map',
  name: 'character-map-page',
  title: 'CharacterMap',
} as const;

export const PLAN_PAGE: Page = {
  path: '/plan',
  name: 'plan-page',
  title: 'Plan',
} as const;

export const TIMELINE_PAGE: Page = {
  path: '/timeline',
  name: 'timeline-page',
  title: 'Timeline',
} as const;
