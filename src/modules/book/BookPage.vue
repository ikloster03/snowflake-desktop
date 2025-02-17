<script lang="ts" setup>
import { NFlex } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <NFlex vertical>
    <h1>{{ t('book-editor') }}</h1>

  </NFlex>
</template>

