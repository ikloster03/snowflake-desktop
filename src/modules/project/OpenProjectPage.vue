<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NFlex, NCard } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from './project.store';

const { t } = useI18n();
const router = useRouter();
const projectStore = useProjectStore();

const openProject = async () => {
  try {
    // TODO: Использовать Tauri API для выбора файла .snflk
    // const path = await open({
    //   filters: [{ name: 'Snowflake Project', extensions: ['snflk'] }]
    // });
    // if (path) {
    //   await projectStore.openProject(path);
    //   router.push({ name: 'project-page' });
    // }
  } catch (error) {
    console.error('Failed to open project:', error);
  }
};
</script>

<template>
  <NCard>
    <h1>{{ t('open-project') }}</h1>
    <NFlex vertical :y-gap="12">
      <p>{{ t('select-project-file') }}</p>
      <NFlex :x-gap="12">
        <NButton @click="openProject">
          {{ t('browse') }}
        </NButton>
        <NButton @click="router.push({ name: 'project-page' })">
          {{ t('cancel') }}
        </NButton>
      </NFlex>
    </NFlex>
  </NCard>
</template>
