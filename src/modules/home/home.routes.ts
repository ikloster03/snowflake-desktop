import { RouteRecordRaw } from 'vue-router';
// import HomePage from './HomePage.vue';
import { HOME_PAGE } from './home.const';
import { BOOK_PAGE } from '../book';

export const routes: RouteRecordRaw[] = [
  {
    path: HOME_PAGE.path,
    name: HOME_PAGE.name,
    // component: HomePage,
    redirect: {
      name: BOOK_PAGE.name
    }
  },
];
