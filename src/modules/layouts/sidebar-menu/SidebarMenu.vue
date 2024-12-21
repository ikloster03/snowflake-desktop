<script setup lang="ts">
import { NIcon, NLayoutSider, NMenu } from 'naive-ui';
import { Component, h } from 'vue';
import {
  Book20Filled as BookIcon,
  Person20Filled as PersonIcon,
} from '@vicons/fluent';
import { RouterLink } from 'vue-router';
import { HOME_PAGE } from '@/modules/home';
import { ABOUT_PAGE } from '@/modules/about';
import { Page } from '@/router.type';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function renderLink(page: Page) {
  return () =>
    h(
      RouterLink,
      {
        to: {
          name: page.name,
        },
      },
      { default: () => page.title }
    );
}

const menuOptions = [
  {
    label: renderLink(HOME_PAGE),
    key: 'hear-the-wind-sing1',
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLink(ABOUT_PAGE),
    key: 'hear-the-wind-sing2',
    icon: renderIcon(PersonIcon),
  },
];
</script>

<template>
  <NLayoutSider
    bordered
    show-trigger
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :native-scrollbar="false"
    style="max-height: 320px"
  >
    <NMenu
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </NLayoutSider>
</template>

<style scoped></style>
