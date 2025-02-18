import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IProject } from './project.types';
import { PRIVATE_STORE_PREFIX } from '@/store.const';
// import { invoke } from '@tauri-apps/api/core';
import { homeDir } from '@tauri-apps/api/path';
import { createID } from '@/core/id';
import { load } from '@tauri-apps/plugin-store';
import { locale } from '@tauri-apps/plugin-os';
import i18n from '@/i18n';

export const PROJECT_STORE = 'project';

const useProjectPrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${PROJECT_STORE}`,
  () => {
    const currentProject = ref<IProject | null>(null);
    const recentProjects = ref<IProject[]>([]);
    const defaultProjectPath = ref<string>('');

    return { currentProject, recentProjects, defaultProjectPath };
  }
);

export const useProjectStore = defineStore(PROJECT_STORE, () => {
  const state = useProjectPrivateStore();

  const currentProject = computed(() => state.currentProject);
  const recentProjects = computed(() => state.recentProjects);
  const hasOpenProject = computed(() => state.currentProject !== null);

  const getDefaultProjectPath = async () => {
    if (!state.defaultProjectPath) {
      // Получаем домашнюю директорию пользователя
      state.defaultProjectPath = await homeDir();
    }
    return state.defaultProjectPath;
  };

  // Функция закрытия проекта
  const closeProject = async () => {
    try {
      // Если есть несохраненные изменения, можно добавить проверку здесь
      state.currentProject = null;
    } catch (error) {
      console.error('Failed to close project:', error);
      throw error;
    }
  };

  // Функция открытия с проверкой
  const openProject = async (path: string) => {
    try {
      if (hasOpenProject.value) {
        throw new Error('Another project is already open. Please close it first.');
      }

      // Сохраняем путь как defaultPath для следующего открытия
      state.defaultProjectPath = path;

      // const project = await invoke<IProject>('open_project', { path });
      const project = {
        id: createID<'Project'>(),
        name: path.split('/').pop() ?? 'Test Project', // получить имя проекта из пути
        description: '',
        path: path,
        created: new Date(),
        updated: new Date(),
      };
      state.currentProject = project;
      await addToRecent(project);

      return project;
    } catch (error) {
      console.error('Failed to open project:', error);
      throw error;
    }
  };

  const loadRecentProjects = async () => {
    // ~/.local/share/com.snowflake.app/.settings.dat # linux (dev)
    // ~/.local/share/{app-name}/.settings.dat # linux
    // C:\Users\{username}\AppData\Roaming\{app-name}\{app-name}\.settings.dat # windows
    // ~/Library/Application Support/{app-name}/.settings.dat # macos
    const store = await load('.settings.dat');
    state.recentProjects = await store.get<IProject[]>('recentProjects') || [];
  };

  const saveRecentProjects = async () => {
    const store = await load('.settings.dat');
    await store.set('recentProjects', state.recentProjects);
  };

  const addToRecent = async (project: IProject) => {
    // проверить, есть ли проект в recentProjects по пути
    const index = state.recentProjects.findIndex((p) => p.path === project.path);

    if (index === -1) {
      state.recentProjects.unshift(project); // вставляем в начало
    } else {
      state.recentProjects[index] = project; // обновляем проект в recentProjects
      state.recentProjects.splice(index, 1);
      state.recentProjects.unshift(project);
    }

    // храним небольше 10 последних проектов
    state.recentProjects = state.recentProjects.filter((_, index) => index < 10);

    await saveRecentProjects();
  };

  const removeFromRecent = async (projectPath: string) => {
    state.recentProjects = state.recentProjects.filter(p => p.path !== projectPath);
    await saveRecentProjects();
  };

  const getLastProject = computed(() => {
    if (!state.recentProjects.length) return null;
    return state.recentProjects[0];
  });

  const getSystemLocale = async () => {
    try {
      const osLocale = await locale();
      return osLocale?.startsWith('ru') ? 'ru' : 'en';
    } catch (error) {
      console.error('Failed to get system locale:', error);
      return 'en';
    }
  };

  const initLocale = async () => {
    const systemLocale = await getSystemLocale();
    i18n.global.locale.value = systemLocale;
  };

  return {
    currentProject,
    recentProjects,
    hasOpenProject,
    openProject,
    closeProject,
    addToRecent,
    removeFromRecent,
    getDefaultProjectPath,
    loadRecentProjects,
    getLastProject,
    initLocale,
  };
});
