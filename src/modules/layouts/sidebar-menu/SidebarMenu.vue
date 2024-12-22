<script setup lang="ts">
import { NIcon, NLayoutSider, NMenu } from 'naive-ui';
import { Component, h, ref } from 'vue';
import {
  Home20Filled as HomeIcon,
  Settings20Filled as SettingsIcon,
  Book20Filled as BookIcon,
  Timeline20Filled as TimelineIcon,
  PeopleCommunity20Filled as CharactersIcon,
} from '@vicons/fluent';
import { World as WorldIcon, Notes as NotesIcon } from '@vicons/tabler';

import { RouterLink } from 'vue-router';
import { HOME_PAGE } from '@/modules/home';
import { Page } from '@/router.type';
import { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { SETTINGS_PAGE } from '@/modules/settings';
import { BOOK_PAGE } from '@/modules/book';
import { LORE_PAGE } from '@/modules/lore';
import {
  CHARACTER_MAP_PAGE,
  PLAN_PAGE,
  TIMELINE_PAGE,
} from '@/modules/projection/projection.routes';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function renderLink(page: Page) {
  return () =>
    h(RouterLink, { to: { name: page.name } }, { default: () => page.title });
}

const menuOptions: MenuMixedOption[] = [
  {
    label: renderLink(HOME_PAGE),
    key: HOME_PAGE.name,
    icon: renderIcon(HomeIcon),
  },
  {
    label: renderLink(BOOK_PAGE),
    key: BOOK_PAGE.name,
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLink(PLAN_PAGE),
    key: PLAN_PAGE.name,
    icon: renderIcon(NotesIcon),
  },
  {
    label: renderLink(LORE_PAGE),
    key: LORE_PAGE.name,
    icon: renderIcon(WorldIcon),
  },
  {
    label: renderLink(TIMELINE_PAGE),
    key: TIMELINE_PAGE.name,
    icon: renderIcon(TimelineIcon),
  },
  {
    label: renderLink(CHARACTER_MAP_PAGE),
    key: CHARACTER_MAP_PAGE.name,
    icon: renderIcon(CharactersIcon),
  },
  {
    label: renderLink(SETTINGS_PAGE),
    key: SETTINGS_PAGE.name,
    icon: renderIcon(SettingsIcon),
  },
];

const firstKeyMenu = menuOptions.at(0)?.key;

if (firstKeyMenu === undefined) {
  throw new Error('Невозможное состояние');
}
</script>

<template>
  <NLayoutSider
    bordered
    collapsed
    collapse-mode="width"
    :collapsed-width="64"
    :native-scrollbar="false"
  >
    <NMenu
      :default-value="firstKeyMenu"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </NLayoutSider>
</template>

<style scoped></style>
