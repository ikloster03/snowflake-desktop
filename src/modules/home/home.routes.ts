import { RouteRecordRaw } from 'vue-router';
import { defineComponent } from 'vue';
// import HomePage from './HomePage.vue';
import { HOME_PAGE } from './home.const';
import { PROJECT_PAGE } from '../project/project.const';
import { BOOK_PAGE } from '../book/book.const';
import { useProjectStore } from '../project/project.store';

export const routes: RouteRecordRaw[] = [
  {
    path: HOME_PAGE.path,
    name: HOME_PAGE.name,
    component: defineComponent({}),
    async beforeEnter(_, __, next) {
      const projectStore = useProjectStore();
      await projectStore.loadRecentProjects();

      const lastProject = projectStore.getLastProject;

      if (lastProject && lastProject.isOpen) {
        try {
          await projectStore.openProject(lastProject);
          next({ name: BOOK_PAGE.name });
        } catch (error) {
          console.error('Failed to open last project:', error);
          next({ name: PROJECT_PAGE.name });
        }
      } else {
        next({ name: PROJECT_PAGE.name });
      }
    }
  },
];
