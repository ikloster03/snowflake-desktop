import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid(
  defineConfig({
    title: 'Snowflake Docs',
    description: 'Документация проекта Snowflake',
    locales: {
      root: {
        label: 'Русский',
        lang: 'ru',
        title: 'Snowflake',
        description: 'Документация проекта Snowflake',
      },
      en: {
        label: 'English',
        lang: 'en',
        title: 'Snowflake',
        description: 'Snowflake Documentation',
        themeConfig: {
          search: {
            provider: 'local',
          },

          nav: [
            { text: 'Home', link: '/en/' },
            { text: 'Downloads', link: '/en/downloads' },
            { text: 'Guide', link: '/en/user-guide' },
            { text: 'Roadmap', link: '/en/roadmap' },
          ],

          sidebar: [
            {
              text: 'Introduction',
              items: [
                { text: 'About the project', link: '/en/readme' },
                { text: 'Navigation', link: '/en/navigation' },
                { text: 'Structure', link: '/en/structure' },
                { text: 'SWOT-analysis', link: '/en/swot' },
              ],
            },
            {
              text: 'Development',
              items: [
                { text: 'Strategy', link: '/en/product-strategy' },
                { text: 'User stories', link: '/en/user-stories-tasks' },
                { text: 'Acceptance criteria', link: '/en/acceptance-criteria' },
                { text: 'Architecture', link: '/en/architecture' },
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
      },
    },

    themeConfig: {
      search: {
        provider: 'local',
      },

      nav: [
        { text: 'Главная', link: '/' },
        { text: 'Загрузки', link: '/downloads' },
        { text: 'Руководство пользователя', link: '/user-guide' },
        { text: 'Дорожная карта', link: '/roadmap' },
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
  })
);
