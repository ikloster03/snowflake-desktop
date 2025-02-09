import { RouteRecordRaw } from 'vue-router';
import { PROJECT_PAGE} from './project.const';
import ProjectPage from './ProjectPage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: PROJECT_PAGE.path,
    name: PROJECT_PAGE.name,
    component: ProjectPage,
  },
];
