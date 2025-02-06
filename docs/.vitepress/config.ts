import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Snowflake Docs",
  description: "Документация проекта Snowflake",
  lang: 'ru-RU',

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Руководство', link: '/guide/' }
    ],

    sidebar: [
      {
        text: 'Введение',
        items: [
          { text: 'О проекте', link: '/readme' },
          { text: 'Навигация', link: '/navigation' },
          { text: 'Структура', link: '/structure' }
        ]
      },
      {
        text: 'Планирование',
        items: [
          { text: 'План разработки', link: '/plan' },
          { text: 'Стратегия', link: '/product-strategy' },
          { text: 'Пользовательские истории', link: '/user-stories-tasks' },
          { text: 'Критерии приемки', link: '/acceptance-criteria' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ikloster03/snowflake-desktop' }
    ]
  }
})
