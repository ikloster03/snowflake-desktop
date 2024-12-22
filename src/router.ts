import { aboutRoutes } from '@/modules/about';
import { homeRoutes } from '@/modules/home';
import { settingsRoutes } from '@/modules/settings';
import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { bookRoutes } from './modules/book';
import { loreRoutes } from './modules/lore';
import { projectionRoutes } from './modules/projection';

const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...aboutRoutes,
  ...bookRoutes,
  ...loreRoutes,
  ...projectionRoutes,
  ...settingsRoutes,
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
