import { Page } from '@/router.type';

export const PROJECT_TYPE = {
  SINGLE_BOOK: 'single-book',
  SERIES: 'series',
} as const;

export const PROJECT_PAGE: Page = {
  path: '/project',
  name: 'project-page',
  title: 'Project',
} as const;
