import { RouteRecordRaw } from 'vue-router';
import LorePage from './LorePage.vue';
import { LORE_PAGE, LORE_WORLD_MAP_PAGE } from './lore.const';
import WorldMapPage from './world-map/WorldMapPage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: LORE_PAGE.path,
    name: LORE_PAGE.name,
    component: LorePage,
  },
  {
    path: LORE_WORLD_MAP_PAGE.path,
    name: LORE_WORLD_MAP_PAGE.name,
    component: WorldMapPage,
  },
];
