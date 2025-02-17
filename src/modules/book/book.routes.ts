import { RouteRecordRaw } from 'vue-router';
import BookPage from './BookPage.vue';
import { BOOK_PAGE } from './book.const';

export const routes: RouteRecordRaw[] = [
  {
    path: BOOK_PAGE.path,
    name: BOOK_PAGE.name,
    component: BookPage,
  },
];
