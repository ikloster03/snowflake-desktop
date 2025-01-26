import { Page } from '@/router.type';

export const BOOK_PAGE: Page = {
  path: '/book',
  name: 'book-page',
  title: 'Book',
} as const;

export const BOOK_NEW_PAGE: Page = {
  path: '/book/new',
  name: 'new-book-page',
  title: 'New Book',
} as const;
