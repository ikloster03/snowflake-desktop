<script setup lang="ts">
import { Person32Filled as Person } from '@vicons/fluent';
import { Menu2 as MenuIcon } from '@vicons/tabler';
import {
  NAvatar,
  NButton,
  NDrawer,
  NDrawerContent,
  NIcon,
  NLayoutSider,
  NMenu,
  NSpace,
} from 'naive-ui';
import { ref } from 'vue';
import menuOptions from './menu';

const firstKeyMenu = menuOptions.at(0)?.key;
const showSettings = ref(false);

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
    <NButton
      quaternary
      style="width: 100%; height: 42px"
      @click="showSettings = true"
    >
      <template #icon>
        <NIcon>
          <MenuIcon />
        </NIcon>
      </template>
    </NButton>
    <NMenu
      :default-value="firstKeyMenu"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </NLayoutSider>
  <NDrawer v-model:show="showSettings" :width="240" placement="left">
    <NDrawerContent>
      <NSpace align="center" justify="space-between">
        <NAvatar round size="large">
          <NIcon>
            <Person />
          </NIcon>
        </NAvatar>
      </NSpace>
      <div>User's name</div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
