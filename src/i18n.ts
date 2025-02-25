import { createI18n } from 'vue-i18n';
import { profileI18n } from '@/modules/profile/profile.i18n';
import { projectI18n } from '@/modules/project/project.i18n';
import { bookI18n } from '@/modules/book/book.i18n';
import { drawerLeftMenuI18n } from '@/modules/layouts/sidebar-menu/drawer-left-menu.i18n';

const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  legacy: false,
  messages: {
    'en-US': {
      ...profileI18n['en-US'],
      ...projectI18n['en-US'],
      ...bookI18n['en-US'],
      ...drawerLeftMenuI18n['en-US'],
    },
    'ru-RU': {
      ...profileI18n['ru-RU'],
      ...projectI18n['ru-RU'],
      ...bookI18n['ru-RU'],
      ...drawerLeftMenuI18n['ru-RU'],
    },
  }
});

export default i18n;
