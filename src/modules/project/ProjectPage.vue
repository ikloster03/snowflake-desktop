<script lang="ts" setup>
import { open } from '@tauri-apps/plugin-dialog';
import { NButton, NCard, NFlex } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from './project.store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BOOK_PAGE } from '../book/book.const';
const { t } = useI18n();
const projectStore = useProjectStore();
const router = useRouter();

const handleCloseProject = async () => {
  try {
    await projectStore.closeProject();
  } catch (error) {
    console.error('Failed to close project:', error);
  }
};

const handleOpenNewProject = async () => {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: t('select-project-directory'),
      defaultPath: await projectStore.getDefaultProjectPath(),
    });

    if (selected) {
      await projectStore.openProject(selected as string);
      await router.push({ name: BOOK_PAGE.name });
    }
  } catch (error) {
    console.error('Failed to open project:', error);
  }
};

const handleOpenProject = async (path: string) => {
  await projectStore.openProject(path);
  await router.push({ name: BOOK_PAGE.name });
};

onMounted(async () => {
  await projectStore.loadRecentProjects();
});
</script>

<template>
  <NFlex vertical :y-gap="24">
    <h1>{{ t('project-manager') }}</h1>

    <!-- Показываем текущий проект, если он открыт -->
    <NCard v-if="projectStore.hasOpenProject">
      <NFlex vertical :y-gap="12">
        <h2>{{ t('current-project') }}</h2>
        <p>{{ projectStore.currentProject?.name }}</p>
        <p>{{ projectStore.currentProject?.description }}</p>
        <p>{{ t('location') }}: {{ projectStore.currentProject?.path }}</p>
        <NButton @click="handleCloseProject">
          {{ t('close-project') }}
        </NButton>
      </NFlex>
    </NCard>

    <!-- Показываем кнопки создания/открытия, только если нет открытого проекта -->
    <NFlex v-else :x-gap="12">
      <NButton @click="handleOpenNewProject">
        {{ t('open-project') }}
      </NButton>
    </NFlex>

    <!-- Показываем недавние проекты, только если нет открытого проекта -->
    <div
      v-if="!projectStore.hasOpenProject && projectStore.recentProjects.length"
    >
      <h2>{{ t('recent-projects') }}</h2>
      <NFlex vertical :y-gap="12">
        <NCard v-for="project in projectStore.recentProjects" :key="project.id">
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <p>
            {{ t('last-updated') }}:
            {{ new Date(project.updated).toLocaleString() }}
          </p>
          <NButton @click="handleOpenProject(project.path)">
            {{ t('open') }}
          </NButton>
        </NCard>
      </NFlex>
    </div>
  </NFlex>
</template>
