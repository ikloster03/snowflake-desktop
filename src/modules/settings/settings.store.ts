import { PRIVATE_STORE_PREFIX } from '@/store.const';
import {
  darkTheme,
  dateEnUS,
  enUS,
  GlobalTheme,
  lightTheme,
  NDateLocale,
  NLocale,
} from 'naive-ui';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import { useProjectStore } from '../project/project.store';
import { DateLocale, Locale, SettingsData, ThemeName } from './settings.types';
import { DICT_LANG } from './settings.const';
import i18n from '@/i18n';
import { locale as osLocale } from '@tauri-apps/plugin-os';

export const SETTINGS_STORE = 'settings';

const DEFAULT_SETTINGS: SettingsData = {
  themeName: 'dark',
  locale: 'en-US',
  dateLocale: 'dateEnUS'
};

const usePrivateSettingsStore = defineStore(`${PRIVATE_STORE_PREFIX}_${SETTINGS_STORE}`, () => {
  const theme = ref<GlobalTheme>(darkTheme);
  const locale = ref<NLocale>(enUS);
  const dateLocale = ref<NDateLocale>(dateEnUS);
  const projectStore = useProjectStore();

  const getTheme = (themeName: ThemeName) => {
    return themeName === 'light' ? lightTheme : darkTheme;
  };

  const getLocale = (lang: Locale) => {
    return DICT_LANG[lang].at(0) as NLocale;
  };

  const getDateLocale = (lang: Locale) => {
    return DICT_LANG[lang].at(1) as NDateLocale;
  };

  const getSystemLocale = async () => {
    try {
      const currentOsLocale = await osLocale();
      return currentOsLocale as Locale;
    } catch (error) {
      console.error('Failed to get system locale:', error);
      return 'en-US';
    }
  };


  // Загрузка настроек
  const loadSettings = async () => {
    if (!projectStore.currentProject?.path) {
      const systemLocale = await getSystemLocale();

      locale.value = getLocale(systemLocale);
      dateLocale.value = getDateLocale(systemLocale);
      theme.value = getTheme('dark');

      i18n.global.locale.value = locale.value.name.split('-')[0] as 'en' | 'ru';
      return;
    };

    try {
      const settingsPath = `${projectStore.currentProject.path}/settings.json`;
      const exists = await fs.exists(settingsPath);

      if (!exists) {
        await fs.writeTextFile(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      }

      const settingsJson = await fs.readTextFile(settingsPath);
      const settings: SettingsData = JSON.parse(settingsJson);

      theme.value = getTheme(settings.themeName);
      locale.value = getLocale(settings.locale);
      dateLocale.value = getDateLocale(settings.locale);

      i18n.global.locale.value = locale.value.name.split('-')[0] as 'en' | 'ru';
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Сохранение настроек
  const saveSettings = async () => {
    if (!projectStore.currentProject?.path) return;

    try {
      const settings: SettingsData = {
        themeName: theme.value.name as ThemeName,
        locale: locale.value.name as Locale,
        dateLocale: dateLocale.value.name as DateLocale
      };

      await fs.writeTextFile(
        `${projectStore.currentProject.path}/settings.json`,
        JSON.stringify(settings, null, 2)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Следим за изменениями проекта
  watch(() => projectStore.currentProject?.path, loadSettings, { immediate: true });

  // Следим за изменениями настроек
  watch([theme, locale, dateLocale], saveSettings);

  return { theme, locale, dateLocale, loadSettings };
});

export const useSettingsStore = defineStore(SETTINGS_STORE, () => {
  const state = usePrivateSettingsStore();

  const theme = computed(() => state.theme);
  const locale = computed(() => state.locale);
  const dateLocale = computed(() => state.dateLocale);

  const toggleTheme = () => {
    state.theme = state.theme.name === 'light' ? darkTheme : lightTheme;
  };

  const changeLocale = (newLocale: NLocale) => {
    state.locale = newLocale;
  };

  const changeDateLocale = (newDateLocale: NDateLocale) => {
    state.dateLocale = newDateLocale;
  };

  return {
    theme,
    locale,
    dateLocale,
    toggleTheme,
    changeLocale,
    changeDateLocale,
    loadSettings: state.loadSettings,
  };
});
