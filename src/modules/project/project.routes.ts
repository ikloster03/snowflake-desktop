import { RouteRecordRaw } from 'vue-router';
import { PROJECT_PAGE, PROJECT_NEW_PAGE, PROJECT_OPEN_PAGE } from './project.const';
import ProjectPage from './ProjectPage.vue';
import NewProjectPage from './NewProjectPage.vue';
import OpenProjectPage from './OpenProjectPage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: PROJECT_PAGE.path,
    name: PROJECT_PAGE.name,
    component: ProjectPage,
  },
  {
    path: PROJECT_NEW_PAGE.path,
    name: PROJECT_NEW_PAGE.name,
    component: NewProjectPage,
  },
  {
    path: PROJECT_OPEN_PAGE.path,
    name: PROJECT_OPEN_PAGE.name,
    component: OpenProjectPage,
  },
];
