<script lang="ts" setup>
import { open } from '@tauri-apps/plugin-dialog';
import { NButton, NCard, NFlex, NSelect, enUS, ruRU } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from './project.store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BOOK_PAGE } from '../book/book.const';
import i18n from '@/i18n';
import { useSettingsStore } from '../settings/settings.store';
import { DICT_LANG } from '../settings/settings.const';
import { Locale } from '../settings/settings.types';
import { IProject, ProjectType } from './project.types';
import { PROJECT_TYPE } from './project.const';

const { t } = useI18n();
const projectStore = useProjectStore();
const settingsStore = useSettingsStore();
const router = useRouter();

const languages = [
  { label: 'English', value: 'en-US' as Locale },
  { label: 'Русский', value: 'ru-RU' as Locale },
];

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
      await projectStore.openNewProject(selected as string);
      await router.push({ name: BOOK_PAGE.name });
    }
  } catch (error) {
    console.error('Failed to open project:', error);
  }
};

const handleOpenProject = async (project: IProject) => {
  await projectStore.openProject(project);
  await router.push({ name: BOOK_PAGE.name });
};

const handleRemoveFromRecent = async (project: IProject) => {
  try {
    await projectStore.removeFromRecent(project);
  } catch (error) {
    console.error('Failed to remove from recent:', error);
  }
};

onMounted(async () => {
  await projectStore.loadRecentProjects();
  await settingsStore.loadSettings();
  console.log(projectStore.recentProjects);
});

const handleLanguageChange = (value: Locale) => {
  const [locale, dateLocale] = DICT_LANG[value];
  i18n.global.locale.value = value as 'en-US' | 'ru-RU';
  settingsStore.changeLocale(locale);
  settingsStore.changeDateLocale(dateLocale);
};

const projectTypes = [
  { label: 'Single Book', value: PROJECT_TYPE.SINGLE_BOOK },
  { label: 'Series', value: PROJECT_TYPE.SERIES },
];

const handleProjectTypeChange = (value: ProjectType) => {
  projectStore.changeProjectType(value);
};
</script>

<template>
  <NFlex vertical :y-gap="24">
    <NFlex justify="space-between" align="center">
      <h1>{{ t('project-manager') }}</h1>
      <NSelect
        :value="settingsStore.locale.name"
        :options="languages"
        @update:value="handleLanguageChange"
        style="width: 120px"
      />
    </NFlex>

    <!-- Показываем текущий проект, если он открыт -->
    <NCard v-if="projectStore.hasOpenProject">
      <NFlex vertical :y-gap="12">
        <h2>{{ t('current-project') }}</h2>
        <div>{{ projectStore.currentProject?.name }}</div>
        <div>
          <NSelect
            :value="projectStore.currentProject?.type"
            :options="projectTypes"
            @update:value="handleProjectTypeChange"
          />
        </div>
        <div>{{ projectStore.currentProject?.description }}</div>
        <div>{{ t('location') }}: {{ projectStore.currentProject?.path }}</div>

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
          <div>{{ project.type }}</div>
          <div>{{ project.description }}</div>
          <div>
            {{ t('last-updated') }}:
            {{ new Date(project.updated).toLocaleString() }}
          </div>
          <NButton @click="handleOpenProject(project)">
            {{ t('open') }}
          </NButton>
          <NButton @click="handleRemoveFromRecent(project)">
            {{ t('remove-from-recent') }}
          </NButton>
        </NCard>
      </NFlex>
    </div>
  </NFlex>
</template>
