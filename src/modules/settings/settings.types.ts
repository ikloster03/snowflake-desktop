export type ThemeName = 'light' | 'dark';
export type Locale = 'en-US' | 'ru-RU';
export type DateLocale = 'dateEnUS' | 'dateRuRU';

export type SettingsData = {
  themeName: ThemeName;
  locale: Locale;
  dateLocale: DateLocale;
};
