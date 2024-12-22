import { Page } from '@/router.type';
import { NIcon } from 'naive-ui';
import { Component, h } from 'vue';
import { RouterLink } from 'vue-router';

export const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

export const renderLink = (page: Page) => {
  return () =>
    h(RouterLink, { to: { name: page.name } }, { default: () => page.title });
};
