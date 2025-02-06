import { RouteRecordRaw } from 'vue-router';
import { PROFILE_PAGE } from './profile.const';
import ProfilePage from './ProfilePage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: PROFILE_PAGE.path,
    name: PROFILE_PAGE.name,
    component: ProfilePage,
  },
];
