import { RouteRecordRaw } from 'vue-router';
import AboutPage from './AboutPage.vue';

export const ABOUT_PAGE = {
  PATH: '/about',
  NAME: 'about-page',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: ABOUT_PAGE.PATH,
    name: ABOUT_PAGE.NAME,
    component: AboutPage,
  },
];
