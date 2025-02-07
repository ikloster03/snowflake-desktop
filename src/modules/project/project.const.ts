import { Page } from '@/router.type';

export const PROJECT_PAGE: Page = {
  path: '/project',
  name: 'project-page',
  title: 'Project',
} as const;

export const PROJECT_NEW_PAGE: Page = {
  path: '/project/new',
  name: 'new-project-page',
  title: 'New Project',
} as const;

export const PROJECT_OPEN_PAGE: Page = {
  path: '/project/open',
  name: 'open-project-page',
  title: 'Open Project',
} as const;
