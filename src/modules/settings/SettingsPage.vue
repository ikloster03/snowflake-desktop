<script lang="ts" setup>
import { enUS, NCard, NSelect, ruRU } from 'naive-ui';
import { useAppStore } from '@/modules/app';
import { computed, ref } from 'vue';
import { SelectBaseOption } from 'naive-ui/es/select/src/interface';

const appStore = useAppStore();

const themeOptions = ref<SelectBaseOption[]>([
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'Light',
    value: 'light',
  },
]);

const defaultThemeOption = computed(() => {
  const option: string | number | undefined = themeOptions.value.find(
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

const langOptions = ref<SelectBaseOption[]>([
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: 'Russian',
    value: 'ru-RU',
  },
]);

const defaultLangOption = computed(() => {
  const option: string | number | undefined = langOptions.value.find(
    (o) => o.value === appStore.locale.name
  )?.value;

  if (option === undefined) {
    throw new Error('Невозможное состояние');
  }

  return option;
});

const dictLang = {
  'en-US': enUS,
  'ru-RU': ruRU,
};

const handleUpdateLang = (value: string) => {
  console.log(value, dictLang[value]);

  appStore.changeLocale(dictLang[value]);
  appStore.changeDateLocale(dictLang[value]);
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

<style scoped></style>
