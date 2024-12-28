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
import { computed, ref } from 'vue';

export const APP_STORE = 'app';

const usePrivateSettingsStore = defineStore(`${PRIVATE_STORE_PREFIX}_${APP_STORE}`, () => {
  const theme = ref<GlobalTheme>(darkTheme);
  const locale = ref<NLocale>(enUS);
  const dateLocale = ref<NDateLocale>(dateEnUS);

  return { theme, locale, dateLocale };
});

export const useSettingsStore = defineStore(APP_STORE, () => {
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
  };
});
