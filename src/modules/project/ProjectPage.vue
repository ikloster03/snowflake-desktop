<script lang="ts" setup>
import { NCard, NButton, NFlex, NAlert } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from './project.store';
import { RouterLink } from 'vue-router';
import { PROJECT_NEW_PAGE, PROJECT_OPEN_PAGE } from './project.const';

const { t } = useI18n();
const projectStore = useProjectStore();

const handleCloseProject = async () => {
  try {
    await projectStore.closeProject();
  } catch (error) {
    console.error('Failed to close project:', error);
  }
};
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
      <RouterLink :to="{ name: PROJECT_NEW_PAGE.name }">
        <NButton>{{ t('create-project') }}</NButton>
      </RouterLink>
      <RouterLink :to="{ name: PROJECT_OPEN_PAGE.name }">
        <NButton>{{ t('open-project') }}</NButton>
      </RouterLink>
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
          <NButton @click="projectStore.openProject(project.path)">
            {{ t('open') }}
          </NButton>
        </NCard>
      </NFlex>
    </div>
  </NFlex>
</template>
