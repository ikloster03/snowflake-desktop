<script setup lang="ts">
import { SETTINGS_PAGE } from '@/modules/settings';
import { PROFILE_PAGE } from '@/modules/profile/profile.const';
import { useSettingsStore } from '@/modules/settings/settings.store';
import { useProfileStore } from '@/modules/profile/profile.store';
import {
  Person32Filled as Person,
  Settings20Filled as SettingsIcon,
  Folder20Filled as Folder,
} from '@vicons/fluent';
import {
  DarkModeOutlined as Dark,
  LightModeOutlined as Light,
  SystemUpdateAltOutlined as UpdateIcon,
} from '@vicons/material';
import { NAvatar, NButton, NDrawerContent, NIcon, NFlex } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { PROJECT_PAGE } from '@/modules/project/project.const';
import { ref, onMounted, computed } from 'vue';
import { getVersion } from '@tauri-apps/api/app';
import UpdaterComponent from '@/modules/app/UpdaterComponent.vue';

type DrawerLeftMenuEmits = {
  (e: 'close'): void;
};

const emit = defineEmits<DrawerLeftMenuEmits>();

const { t } = useI18n();
const settingsStore = useSettingsStore();
const profileStore = useProfileStore();

const updaterRef = ref<InstanceType<typeof UpdaterComponent>>();
const currentVersion = ref('');

// Вычисляемое свойство для отображения имени пользователя
const displayName = computed(() => {
  return profileStore.userProfile?.displayName || 'Без имени';
});

const handleCheckUpdates = () => {
  updaterRef.value?.checkForUpdates();
};

const loadVersion = async () => {
  try {
    currentVersion.value = await getVersion();
  } catch (error) {
    console.error('Ошибка получения версии:', error);
    currentVersion.value = '0.1.0';
  }
};

const loadProfile = async () => {
  try {
    await profileStore.getOrCreateProfile();
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  }
};

onMounted(() => {
  loadVersion();
  loadProfile();
});
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
        <div>{{ displayName }}</div>
        <RouterLink
          v-slot="{ navigate }"
          :to="{ name: PROFILE_PAGE.name }"
          @click="emit('close')"
        >
          <NButton text @click="navigate">
            <template #icon>
              <NIcon> <Person /> </NIcon>
            </template>
            {{ t('profile') }}
          </NButton>
        </RouterLink>
        <RouterLink
          v-slot="{ navigate }"
          :to="{ name: PROJECT_PAGE.name }"
          @click="emit('close')"
        >
          <NButton text @click="navigate">
            <template #icon>
              <NIcon>
                <Folder />
              </NIcon>
            </template>
            {{ t('project') }}
          </NButton>
        </RouterLink>
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
        <NButton text @click="handleCheckUpdates">
          <template #icon>
            <NIcon>
              <UpdateIcon />
            </NIcon>
          </template>
          Проверить обновления
        </NButton>
      </NFlex>
      <div>
        <div>Snowflake desktop</div>
        <div>Version {{ currentVersion || '0.1.0' }}</div>
      </div>
    </NFlex>

    <!-- Компонент обновлений -->
    <UpdaterComponent ref="updaterRef" />
  </NDrawerContent>
</template>

<style scoped></style>
