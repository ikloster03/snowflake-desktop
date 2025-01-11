<script setup lang="ts">
import { Menu2 as MenuIcon } from '@vicons/tabler';
import { NButton, NDrawer, NIcon, NLayoutSider, NMenu } from 'naive-ui';
import { ref } from 'vue';
import DrawerLeftMenu from './DrawerLeftMenu.vue';
import menuOptions from './menu';
import { Key } from 'naive-ui/es/cascader/src/interface';

const showSettings = ref(false);
const menuValue = ref<Key | null>(menuOptions.at(0)?.key ?? null);

const close = () => {
  showSettings.value = false;
  menuValue.value = null;
};
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
      v-model:value="menuValue"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </NLayoutSider>
  <NDrawer v-model:show="showSettings" :width="240" placement="left">
    <DrawerLeftMenu @close="close" />
  </NDrawer>
</template>

<style scoped></style>
