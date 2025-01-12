<script setup lang="ts">
import { SETTINGS_PAGE } from '@/modules/settings';
import { useSettingsStore } from '@/modules/settings/settings.store';
import {
  Person32Filled as Person,
  Settings20Filled as SettingsIcon,
} from '@vicons/fluent';
import {
  DarkModeOutlined as Dark,
  LightModeOutlined as Light,
} from '@vicons/material';
import { NAvatar, NButton, NDrawerContent, NIcon, NFlex } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

type DrawerLeftMenuEmits = {
  (e: 'close'): void;
};

const emit = defineEmits<DrawerLeftMenuEmits>();

const { t } = useI18n();
const settingsStore = useSettingsStore();
</script>

<template>
  <NDrawerContent>
    <NFlex vertical justify="space-between" style="height: 100%">
      <NFlex vertical>
        <NFlex align="center" justify="space-between">
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
        </NFlex>
        <div>Иван Иванов</div>
        <RouterLink
          v-slot="{ navigate }"
          :to="{ name: SETTINGS_PAGE.name }"
          @click="emit('close')"
        >
          <NButton text @click="navigate">
            <template #icon>
              <NIcon>
                <SettingsIcon />
              </NIcon>
            </template>
            {{ t('settings') }}
          </NButton>
        </RouterLink>
      </NFlex>
      <div>
        <div>Snowflake desktop</div>
        <div>Version 0.1</div>
      </div>
    </NFlex>
  </NDrawerContent>
</template>

<i18n>
  {
    "en": {
      "settings": "Settings",
    },
    "ru": {
      "settings": "Настройки",
    }
  }
</i18n>

<style scoped></style>
