import { RouteRecordRaw } from 'vue-router';
import { Page } from '@/router.type';
import BookPage from './BookPage.vue';

export const BOOK_PAGE: Page = {
  path: '/book',
  name: 'book-page',
  title: 'Book',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: BOOK_PAGE.path,
    name: BOOK_PAGE.name,
    component: BookPage,
  },
];
