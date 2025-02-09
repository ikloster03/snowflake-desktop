import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IProject } from './project.types';
import { PRIVATE_STORE_PREFIX } from '@/store.const';
// import { invoke } from '@tauri-apps/api/core';
import { homeDir } from '@tauri-apps/api/path';
import { createID } from '@/core/id';

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

  const createProject = async (project: Omit<IProject, 'id' | 'created' | 'updated'>) => {
    // TODO: Реализовать создание проекта через Tauri API
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
      addToRecent(project);

      return project;
    } catch (error) {
      console.error('Failed to open project:', error);
      throw error;
    }
  };

  const addToRecent = (project: IProject) => {
    // проверить, есть ли проект в recentProjects по пути
    const index = state.recentProjects.findIndex((p) => p.path === project.path);

    if (index === -1) {
      state.recentProjects.unshift(project); // вставляем в начало
    } else {
      state.recentProjects[index] = project; // обновляем проект в recentProjects
    }
  };

  return {
    currentProject,
    recentProjects,
    hasOpenProject,
    createProject,
    openProject,
    closeProject,
    addToRecent,
    getDefaultProjectPath,
  };
});
