import { RouteRecordRaw } from 'vue-router';
import { Page } from '@/router.type';
import SettingsPage from './SettingsPage.vue';

export const SETTINGS_PAGE: Page = {
  path: '/settings',
  name: 'settings-page',
  title: 'Settings',
} as const;

export const routes: RouteRecordRaw[] = [
  {
    path: SETTINGS_PAGE.path,
    name: SETTINGS_PAGE.name,
    component: SettingsPage,
  },
];
