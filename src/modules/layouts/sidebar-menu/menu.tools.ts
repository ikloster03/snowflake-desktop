import { Page } from '@/router.type';
import { NIcon } from 'naive-ui';
import { Component, h } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

export const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

export const renderLink = (page: Page) => {
  return () => {
    const { t } = useI18n();

    return h(RouterLink, { to: { name: page.name } }, { default: () => t(page.title) });
  }
};
