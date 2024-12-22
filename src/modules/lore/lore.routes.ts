import { RouteRecordRaw } from 'vue-router';
import LorePage from './LorePage.vue';
import { Page } from '@/router.type';

export const LORE_PAGE: Page = {
  path: '/lore',
  name: 'lore-page',
  title: 'Lore',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: LORE_PAGE.path,
    name: LORE_PAGE.name,
    component: LorePage,
  },
];
