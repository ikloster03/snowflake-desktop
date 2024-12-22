<script setup lang="ts">
import SidebarMenu from '@/modules/layouts/sidebar-menu/SidebarMenu.vue';
import { NConfigProvider, NLayoutContent } from 'naive-ui';
import { useAppStore } from './app.store';
import AppProvider from './AppProvider.vue';

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
      <NLayoutContent content-style="padding: 24px;">
        <RouterView class="bg-layout" />
      </NLayoutContent>
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
<style></style>
