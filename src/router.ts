import { createMemoryHistory, createRouter } from 'vue-router';

import HomePage from './modules/home/HomePage.vue';
import AboutPage from './modules/about/AboutPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
