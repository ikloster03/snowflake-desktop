import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid(
  defineConfig({
    title: 'Snowflake Docs',
    description: 'Документация проекта Snowflake',
    lang: 'ru-RU',

    themeConfig: {
      search: {
        provider: 'local',
      },

      nav: [
        { text: 'Главная', link: '/' },
        { text: 'Руководство', link: '/guide/' },
        { text: 'Архитектура', link: '/architecture' },
        { text: 'Разработка', link: '/development/' },
      ],

      sidebar: [
        {
          text: 'Введение',
          items: [
            { text: 'О проекте', link: '/readme' },
            { text: 'Навигация', link: '/navigation' },
            { text: 'Структура', link: '/structure' },
            { text: 'SWOT-анализ', link: '/swot' },
          ],
        },
        {
          text: 'Разработка',
          items: [
            { text: 'План разработки', link: '/plan' },
            { text: 'Стратегия', link: '/product-strategy' },
            { text: 'Пользовательские истории', link: '/user-stories-tasks' },
            { text: 'Критерии приемки', link: '/acceptance-criteria' },
            { text: 'Архитектура', link: '/architecture' },
          ],
        },
      ],

      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/ikloster03/snowflake-desktop',
        },
      ],
    },

    // markdown: {
    //   config: (md) => {
    //     // Включаем поддержку диаграмм mermaid
    //     md.use(require('markdown-it-mermaid'))
    //   }
    // }
  })
);
