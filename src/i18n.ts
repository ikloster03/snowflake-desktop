import { createI18n } from 'vue-i18n';
import { bookI18n } from '@/modules/book/book/book.i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en: {
      ...bookI18n.en,
      // ... другие переводы
    },
    ru: {
      ...bookI18n.ru,
      // ... другие переводы
    },
  }
});

export default i18n;
