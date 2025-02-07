import DefaultTheme from 'vitepress/theme'
import './custom.css'
// import 'vitepress-plugin-mermaid/dist/theme.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Регистрируем компоненты если необходимо
  }
}
