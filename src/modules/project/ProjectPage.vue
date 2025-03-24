<script lang="ts" setup>
import { open } from '@tauri-apps/plugin-dialog';
import {
  NButton,
  NCard,
  NFlex,
  NSelect,
  enUS,
  ruRU,
  useDialog,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from './project.store';
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BOOK_PAGE } from '../book/book.const';
import i18n from '@/i18n';
import { useSettingsStore } from '../settings/settings.store';
import { DICT_LANG } from '../settings/settings.const';
import { Locale } from '../settings/settings.types';
import { IProject, ProjectType } from './project.types';
import { PROJECT_TYPE } from './project.const';
import { useBookPrivateStore } from '../book/book.store';

const { t } = useI18n();
const projectStore = useProjectStore();
const settingsStore = useSettingsStore();
const bookStore = useBookPrivateStore();
const router = useRouter();
const dialog = useDialog();

const languages = [
  { label: 'English', value: 'en-US' as Locale },
  { label: 'Русский', value: 'ru-RU' as Locale },
];

// Состояние сохранения проекта
const isSaving = ref(false);

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
      title: t('select-directory'),
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

// Получаем все серии книг в проекте
const allSeries = computed(() => {
  return bookStore.series;
});

// Получаем книги текущего проекта
const getBooksInCurrentProject = () => {
  // Если проект еще не инициализирован, возвращаем пустой массив
  if (!projectStore.currentProject) return [];

  // Для простоты считаем, что все книги в хранилище относятся к текущему проекту,
  // так как мы не можем открыть несколько проектов одновременно
  return bookStore.books;
};

const handleProjectTypeChange = (value: ProjectType) => {
  // Если меняем с SERIES на SINGLE_BOOK, проверяем количество книг
  if (
    projectStore.currentProject?.type === PROJECT_TYPE.SERIES &&
    value === PROJECT_TYPE.SINGLE_BOOK
  ) {
    const books = getBooksInCurrentProject();

    // Если книг больше одной, показываем предупреждение и отменяем изменение
    if (books.length > 1) {
      dialog.warning({
        title: t('errors.cant-change-type.title'),
        content: t('errors.cant-change-type.content'),
        positiveText: t('common.ok'),
      });
      return;
    }

    // Если есть ровно одна книга, автоматически устанавливаем ее как текущую
    if (books.length === 1) {
      const bookId = books[0].id;
      projectStore.setCurrentBook(bookId);
    }
  }

  // Если проверка пройдена, меняем тип проекта
  projectStore.changeProjectType(value);

  // Сохраняем проект
  projectStore.saveCurrentProject().catch((error) => {
    console.error('Не удалось сохранить проект:', error);
    dialog.error({
      title: t('save-error.title'),
      content: t('save-error.content'),
      positiveText: t('common.ok'),
    });
  });
};

// Обработчик сохранения проекта
const handleSaveProject = async () => {
  try {
    isSaving.value = true;
    await projectStore.saveCurrentProject();
    dialog.success({
      title: t('save-success.title'),
      content: t('save-success.content'),
      positiveText: t('common.ok'),
    });
  } catch (error) {
    dialog.error({
      title: t('save-error.title'),
      content: t('save-error.content'),
      positiveText: t('common.ok'),
    });
    console.error('Ошибка сохранения проекта:', error);
  } finally {
    isSaving.value = false;
  }
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
        <NFlex justify="space-between" align="center">
          <h2>{{ t('current-project') }}</h2>
          <NButton
            type="primary"
            @click="handleSaveProject"
            :loading="isSaving"
          >
            {{ t('save') }}
          </NButton>
        </NFlex>

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
