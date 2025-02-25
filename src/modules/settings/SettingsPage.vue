<script lang="ts" setup>
import i18n from '@/i18n';
import { dateEnUS, dateRuRU, enUS, NCard, NSelect, ruRU } from 'naive-ui';
import { SelectBaseOption } from 'naive-ui/es/select/src/interface';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from './settings.store';
import { DATE_LOCALE_OPTIONS, DICT_LANG, THEME_OPTIONS } from './settings.const';

const { t } = useI18n();
const appStore = useSettingsStore();

const [DARK_THEME, LIGHT_THEME] = THEME_OPTIONS;
const [EN_LOCALE, RU_LOCALE] = DATE_LOCALE_OPTIONS;

const themeOptions = computed<SelectBaseOption<string, string>[]>(() => [
  {
    label: `${t(DARK_THEME)}`,
    value: DARK_THEME,
  },
  {
    label: `${t(LIGHT_THEME)}`,
    value: LIGHT_THEME,
  },
]);

const defaultThemeOption = computed(() => {
  const option: string | undefined = themeOptions.value.find(
    (o) => o.value === appStore.theme.name
  )?.value;

  if (option === undefined) {
    throw new Error('Невозможное состояние');
  }

  return option;
});

const handleUpdateTheme = (value: string) => {
  if (value !== appStore.theme.name) {
    appStore.toggleTheme();
  }
};

const langOptions = computed<SelectBaseOption<string, string>[]>(() => [
  {
    label: `${t('english')}`,
    value: EN_LOCALE,
  },
  {
    label: `${t('russian')}`,
    value: RU_LOCALE,
  },
]);

const defaultLangOption = computed(() => {
  const option: string | undefined = langOptions.value.find(
    (o) => o.value === appStore.locale.name
  )?.value;

  if (option === undefined) {
    throw new Error('Невозможное состояние');
  }

  return option;
});

const handleUpdateLang = (value: 'en-US' | 'ru-RU') => {
  const [locale, dateLocale] = DICT_LANG[value];

  i18n.global.locale.value = value.split('-')[0] as 'en-US' | 'ru-RU';

  appStore.changeLocale(locale);
  appStore.changeDateLocale(dateLocale);
};
</script>

<template>
  <NCard>
    <h1>Settings</h1>
    <NSelect
      :defaultValue="defaultThemeOption"
      :options="themeOptions"
      @update:value="handleUpdateTheme"
    />
    <NSelect
      :defaultValue="defaultLangOption"
      :options="langOptions"
      @update:value="handleUpdateLang"
    />
  </NCard>
</template>

<i18n>
  {
    "en": {
      "dark": "Dark",
      "light": "Light",
      "english": "English",
      "russian": "Russian",
    },
    "ru": {
      "dark": "Темная тема",
      "light": "Светлая тема",
      "english": "Английский язык",
      "russian": "Русский язык",
    }
  }
</i18n>

<style scoped></style>
