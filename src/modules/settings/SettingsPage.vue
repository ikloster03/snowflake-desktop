<script lang="ts" setup>
import { NCard, NSelect } from 'naive-ui';
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
</script>

<template>
  <NCard>
    <h1>Settings</h1>
    <NSelect
      :defaultValue="defaultThemeOption"
      :options="themeOptions"
      @update:value="handleUpdateTheme"
    />
  </NCard>
</template>

<style scoped></style>
