<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import { useAppStore } from './app.store';
import AppProvider from './AppProvider.vue';
import { HOME_PAGE } from '@/modules/home';
import { ABOUT_PAGE } from '@/modules/about';

const appStore = useAppStore();
</script>

<template>
  <NConfigProvider
    :theme="appStore.theme"
    :locale="appStore.locale"
    :date-locale="appStore.dateLocale"
    class="h-full"
  >
    <AppProvider>
      <nav>
        <RouterLink :to="{ name: HOME_PAGE.NAME }">Go to Home</RouterLink>
        <RouterLink :to="{ name: ABOUT_PAGE.NAME }">Go to About</RouterLink>
        <a href="#" @click.prevent="appStore.toggleTheme"
          >Change theme {{ appStore.theme.name }}</a
        >
      </nav>
      <RouterView class="bg-layout" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
<style></style>
