import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Регистрируем компоненты если необходимо
  },
};
