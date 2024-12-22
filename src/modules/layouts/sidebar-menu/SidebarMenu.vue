<script setup lang="ts">
import { NLayoutSider, NMenu } from 'naive-ui';
import menuOptions from './menu';

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
