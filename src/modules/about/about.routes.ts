import { RouteRecordRaw } from 'vue-router';
import AboutPage from './AboutPage.vue';
import { Page } from '@/router.type';

export const ABOUT_PAGE: Page = {
  path: '/about',
  name: 'about-page',
  title: 'About',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: ABOUT_PAGE.path,
    name: ABOUT_PAGE.name,
    component: AboutPage,
  },
];
