import {
  darkTheme,
  dateRuRU,
  GlobalTheme,
  lightTheme,
  NDateLocale,
  NLocale,
  ruRU,
  enUS,
  dateEnUS,
} from 'naive-ui';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const APP_STORE = 'app';

const useAppPrivateStore = defineStore(`PRIVATE_${APP_STORE}`, () => {
  const theme = ref<GlobalTheme>(lightTheme);
  const locale = ref<NLocale>(enUS);
  const dateLocale = ref<NDateLocale>(dateEnUS);

  return { theme, locale, dateLocale };
});

export const useAppStore = defineStore(APP_STORE, () => {
  const state = useAppPrivateStore();

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
