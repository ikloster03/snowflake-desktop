<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import { useAppStore } from './app.store';
import AppProvider from './AppProvider.vue';
import SidebarMenu from '@/modules/layouts/sidebar-menu/SidebarMenu.vue';

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
      <SidebarMenu />
      <n-layout-content content-style="padding: 24px;">
        <RouterView class="bg-layout" />
      </n-layout-content>
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
<style></style>
