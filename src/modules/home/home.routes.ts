import { RouteRecordRaw } from 'vue-router';
import HomePage from './HomePage.vue';

export const HOME_PAGE = {
  PATH: '/',
  NAME: 'home-page',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: HOME_PAGE.PATH,
    name: HOME_PAGE.NAME,
    component: HomePage,
  },
];
