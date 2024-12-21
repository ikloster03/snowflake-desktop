import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { aboutRoutes } from '@/modules/about';
import { homeRoutes } from '@/modules/home';

const routes: RouteRecordRaw[] = [...homeRoutes, ...aboutRoutes];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
