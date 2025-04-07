import { bookRoutes } from '@/modules/book';
import { homeRoutes } from '@/modules/home';
import { loreRoutes } from '@/modules/lore';
import { projectionRoutes } from '@/modules/projection';
import { settingsRoutes } from '@/modules/settings';
import { routes as profileRoutes } from '@/modules/profile/profile.routes';
import { routes as projectRoutes } from '@/modules/project/project.routes';
import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...bookRoutes,
  ...loreRoutes,
  ...projectionRoutes,
  ...settingsRoutes,
  ...profileRoutes,
  ...projectRoutes,
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
