import { RouteRecordRaw } from 'vue-router';
import HomePage from './HomePage.vue';
import { Page } from '@/router.type';

export const HOME_PAGE: Page = {
  path: '/',
  name: 'home-page',
  title: 'Home',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: HOME_PAGE.path,
    name: HOME_PAGE.name,
    component: HomePage,
  },
];
