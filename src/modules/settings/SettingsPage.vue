<script lang="ts" setup>
import { NCard } from 'naive-ui';
import { useAppStore } from '@/modules/app';

const appStore = useAppStore();
</script>

<template>
  <NCard>
    <h1>Settings</h1>
    <a href="#" @click.prevent="appStore.toggleTheme"
      >Change theme {{ appStore.theme.name }}</a
    >
  </NCard>
</template>

<style scoped></style>
