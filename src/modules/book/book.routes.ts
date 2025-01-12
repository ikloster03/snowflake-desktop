import { RouteRecordRaw } from 'vue-router';
import BookPage from './BookPage.vue';
import { BOOK_PAGE } from './book.const';
import { routes as authorRoutes } from './author/author.routes';

export const routes: RouteRecordRaw[] = [
  {
    path: BOOK_PAGE.path,
    name: BOOK_PAGE.name,
    component: BookPage,
  },
  ...authorRoutes,
];
