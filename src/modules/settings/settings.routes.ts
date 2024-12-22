import { RouteRecordRaw } from 'vue-router';
import SettingsPage from './SettingsPage.vue';
import { SETTINGS_PAGE } from './settings.const';

export const routes: RouteRecordRaw[] = [
  {
    path: SETTINGS_PAGE.path,
    name: SETTINGS_PAGE.name,
    component: SettingsPage,
  },
];
