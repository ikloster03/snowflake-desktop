import { RouteRecordRaw } from 'vue-router';
// import HomePage from './HomePage.vue';
import { HOME_PAGE } from './home.const';
// import { BOOK_PAGE } from '../book';
import { PROJECT_PAGE } from '../project/project.const';

export const routes: RouteRecordRaw[] = [
  {
    path: HOME_PAGE.path,
    name: HOME_PAGE.name,
    // component: HomePage,
    redirect: {
      // name: BOOK_PAGE.name
      path: PROJECT_PAGE.path,
    }
  },
];
