import { Page } from '@/router.type';
import { enUS, ruRU, dateEnUS, dateRuRU, NLocale, NDateLocale } from 'naive-ui';
import { Locale } from './settings.types';

export const SETTINGS_PAGE: Page = {
  path: '/settings',
  name: 'settings-page',
  title: 'Settings',
} as const;

export const THEME_OPTIONS = ['light', 'dark'] as const;

export const DATE_LOCALE_OPTIONS = ['en-US', 'ru-RU'] as const;

const [EN_LOCALE, RU_LOCALE] = DATE_LOCALE_OPTIONS;

export const DICT_LANG: Record<Locale, [NLocale, NDateLocale]> = {
  [EN_LOCALE]: [enUS, dateEnUS],
  [RU_LOCALE]: [ruRU, dateRuRU],
} as const;

export const AVAILABLE_LANGUAGES = [
  { label: 'English', value: 'en-US' as Locale },
  { label: 'Русский', value: 'ru-RU' as Locale }
];
