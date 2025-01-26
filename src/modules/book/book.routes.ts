import { RouteRecordRaw } from 'vue-router';
import BookPage from './BookPage.vue';
import NewBookPage from './NewBookPage.vue';
import { BOOK_PAGE, BOOK_NEW_PAGE } from './book.const';
import { routes as authorRoutes } from './author/author.routes';

export const routes: RouteRecordRaw[] = [
  {
    path: BOOK_PAGE.path,
    name: BOOK_PAGE.name,
    component: BookPage,
  },
  {
    path: BOOK_NEW_PAGE.path,
    name: BOOK_NEW_PAGE.name,
    component: NewBookPage,
  },
  ...authorRoutes,
];
