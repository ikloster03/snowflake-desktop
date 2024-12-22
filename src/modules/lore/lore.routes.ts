import { RouteRecordRaw } from 'vue-router';
import LorePage from './LorePage.vue';
import { LORE_PAGE } from './lore.const';

export const routes: RouteRecordRaw[] = [
  {
    path: LORE_PAGE.path,
    name: LORE_PAGE.name,
    component: LorePage,
  },
];
