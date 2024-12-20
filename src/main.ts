import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const setupApp = async () => {
  const app = createApp(App);

  app.use(router);
  app.mount('#app');
};

setupApp();
