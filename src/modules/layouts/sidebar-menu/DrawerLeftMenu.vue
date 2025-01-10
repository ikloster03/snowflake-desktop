<script setup lang="ts">
import { NAvatar, NButton, NDrawerContent, NIcon, NSpace } from 'naive-ui';
import { Person32Filled as Person } from '@vicons/fluent';
import {
  LightModeOutlined as Light,
  DarkModeOutlined as Dark,
} from '@vicons/material';
import { useSettingsStore } from '@/modules/settings/settings.store';

const settingsStore = useSettingsStore();
</script>

<template>
  <NDrawerContent>
    <NSpace align="center" justify="space-between">
      <NAvatar round size="large">
        <NIcon>
          <Person />
        </NIcon>
      </NAvatar>
      <NButton strong secondary circle @click="settingsStore.toggleTheme()">
        <template #icon>
          <NIcon>
            <Light v-if="settingsStore.theme.name === 'dark'" />
            <Dark v-if="settingsStore.theme.name === 'light'" />
          </NIcon>
        </template>
      </NButton>
    </NSpace>
    <div>Иван Иванов</div>
  </NDrawerContent>
</template>

<style scoped></style>
