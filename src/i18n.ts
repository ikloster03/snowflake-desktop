import { createI18n } from 'vue-i18n';
import { profileI18n } from '@/modules/profile/profile.i18n';
import { projectI18n } from '@/modules/project/project.i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en: {
      ...profileI18n.en,
      ...projectI18n.en,
    },
    ru: {
      ...profileI18n.ru,
      ...projectI18n.ru,
    },
  }
});

export default i18n;
