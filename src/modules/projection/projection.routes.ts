import { RouteRecordRaw } from 'vue-router';
import CharacterMapPage from './character-map/CharacterMapPage.vue';
import PlanPage from './plan/PlanPage.vue';
import {
  CHARACTER_MAP_PAGE,
  PLAN_PAGE,
  PROJECTION_PAGE,
  TIMELINE_PAGE,
  STAGE_PAGE,
} from './projection.const';
import TimelinePage from './timeline/TimelinePage.vue';
import StagePage from './stage/StagePage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: PROJECTION_PAGE.path,
    name: PROJECTION_PAGE.name,
    children: [
      {
        path: CHARACTER_MAP_PAGE.path,
        name: CHARACTER_MAP_PAGE.name,
        component: CharacterMapPage,
      },
      {
        path: PLAN_PAGE.path,
        name: PLAN_PAGE.name,
        component: PlanPage,
      },
      {
        path: TIMELINE_PAGE.path,
        name: TIMELINE_PAGE.name,
        component: TimelinePage,
      },
      {
        path: STAGE_PAGE.path,
        name: STAGE_PAGE.name,
        component: StagePage,
      },
    ],
  },
];
