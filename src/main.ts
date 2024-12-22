import { App } from '@/modules/app';
import { createApp } from 'vue';
import i18n from './i18n';
import router from './router';
import store from './store';

const setupApp = async () => {
  const app = createApp(App);

  app.use(i18n);
  app.use(store);
  app.use(router);

  app.mount('#app');
};

setupApp();
