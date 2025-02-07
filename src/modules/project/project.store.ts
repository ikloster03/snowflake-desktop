import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IProject, IProjectMeta } from './project.types';
import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { invoke } from '@tauri-apps/api/core';

export const PROJECT_STORE = 'project';

const useProjectPrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${PROJECT_STORE}`,
  () => {
    const currentProject = ref<IProject | null>(null);
    const recentProjects = ref<IProjectMeta[]>([]);

    return { currentProject, recentProjects };
  }
);

export const useProjectStore = defineStore(PROJECT_STORE, () => {
  const state = useProjectPrivateStore();

  const currentProject = computed(() => state.currentProject);
  const recentProjects = computed(() => state.recentProjects);

  // Добавим геттер для проверки открытого проекта
  const hasOpenProject = computed(() => state.currentProject !== null);

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
      // Проверяем, есть ли открытый проект
      if (hasOpenProject.value) {
        throw new Error('Another project is already open. Please close it first.');
      }

      const project = await invoke<IProject>('open_project', { path });
      state.currentProject = project;
      addToRecent({
        id: project.id,
        name: project.name,
        description: project.description,
        path: project.path,
        created: project.created,
        updated: project.updated,
      });
      return project;
    } catch (error) {
      console.error('Failed to open project:', error);
      throw error;
    }
  };

  const addToRecent = (project: IProjectMeta) => {
    state.recentProjects = [project, ...state.recentProjects.slice(0, 9)];
  };

  return {
    currentProject,
    recentProjects,
    hasOpenProject,
    createProject,
    openProject,
    closeProject,
    addToRecent,
  };
});
