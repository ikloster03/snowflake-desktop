<script setup lang="ts">
import {
  GlobalTheme,
  NConfigProvider,
  NDateLocale,
  NLocale,
  darkTheme,
  ruRU,
  dateRuRU,
} from 'naive-ui';
import { ref } from 'vue';

const theme = ref<GlobalTheme | null>(darkTheme);
const locale = ref<NLocale | null>(ruRU);
const dateLocale = ref<NDateLocale | null>(dateRuRU);
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :locale="locale"
    :date-locale="dateLocale"
    class="h-full"
  >
    <AppProvider>
      <nav>
        <RouterLink to="/">Go to Home</RouterLink>
        <RouterLink to="/about">Go to About</RouterLink>
      </nav>
      <RouterView class="bg-layout" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
<style></style>
