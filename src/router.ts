import { aboutRoutes } from '@/modules/about';
import { bookRoutes } from '@/modules/book';
import { homeRoutes } from '@/modules/home';
import { loreRoutes } from '@/modules/lore';
import { projectionRoutes } from '@/modules/projection';
import { settingsRoutes } from '@/modules/settings';
import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router';

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
