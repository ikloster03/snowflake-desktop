<script setup lang="ts">
import SidebarMenu from '@/modules/layouts/sidebar-menu/SidebarMenu.vue';
import { NConfigProvider, NLayoutContent } from 'naive-ui';
import { useSettingsStore } from '@/modules/settings/settings.store';
import AppProvider from './AppProvider.vue';

const settingsStore = useSettingsStore();
</script>

<template>
  <NConfigProvider
    :theme="settingsStore.theme"
    :locale="settingsStore.locale"
    :date-locale="settingsStore.dateLocale"
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
