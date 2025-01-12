import { RouteRecordRaw } from 'vue-router';
import { AUTHOR_NEW_PAGE } from './author.const';
import AuthorPage from './AuthorPage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: AUTHOR_NEW_PAGE.path,
    name: AUTHOR_NEW_PAGE.name,
    component: AuthorPage,
  },
];
