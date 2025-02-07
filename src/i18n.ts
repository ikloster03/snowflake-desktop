import { createI18n } from 'vue-i18n';
import { bookI18n } from '@/modules/book/book/book.i18n';
import { seriesI18n } from '@/modules/book/series/series.i18n';
import { profileI18n } from '@/modules/profile/profile.i18n';
import { projectI18n } from '@/modules/project/project.i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en: {
      ...bookI18n.en,
      ...seriesI18n.en,
      ...profileI18n.en,
      ...projectI18n.en,
    },
    ru: {
      ...bookI18n.ru,
      ...seriesI18n.ru,
      ...profileI18n.ru,
      ...projectI18n.ru,
    },
  }
});

export default i18n;
