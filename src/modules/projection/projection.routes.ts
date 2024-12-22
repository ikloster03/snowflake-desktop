import { RouteRecordRaw } from 'vue-router';
import { Page } from '@/router.type';
import ProjectionPage from './ProjectionPage.vue';
import CharacterMapPage from './character-map/CharacterMapPage.vue';
import PlanPage from './plan/PlanPage.vue';
import TimelinePage from './timeline/TimelinePage.vue';

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

export const routes: RouteRecordRaw[] = [
  {
    path: PROJECTION_PAGE.path,
    name: PROJECTION_PAGE.name,
    children: [
      {
        path: CHARACTER_MAP_PAGE.path,
        name: CHARACTER_MAP_PAGE.name,
        component: CharacterMapPage,
      },
      {
        path: PLAN_PAGE.path,
        name: PLAN_PAGE.name,
        component: PlanPage,
      },
      {
        path: TIMELINE_PAGE.path,
        name: TIMELINE_PAGE.name,
        component: TimelinePage,
      },
    ],
  },
];
