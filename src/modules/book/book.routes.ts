import { RouteRecordRaw } from 'vue-router';
import BookPage from './BookPage.vue';
import NewBookPage from './book/NewBookPage.vue';
import SeriesPage from './series/SeriesPage.vue';
import { BOOK_PAGE, BOOK_NEW_PAGE, SERIES_NEW_PAGE } from './book.const';
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
  {
    path: SERIES_NEW_PAGE.path,
    name: SERIES_NEW_PAGE.name,
    component: SeriesPage,
  },
  ...authorRoutes,
];
