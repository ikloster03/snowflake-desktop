<script lang="ts" setup>
import { NGrid, NGridItem } from 'naive-ui';
import { usePrivateItemStore } from './item.store';
import NewItem from './NewItem.vue';
import ItemCard from './ItemCard.vue';

const store = usePrivateItemStore();
</script>

<template>
  <NGrid
    cols="1 s:2 m:3 l:4 xl:5 2xl:6"
    responsive="screen"
    :x-gap="12"
    :y-gap="12"
  >
    <NGridItem v-for="item in store.items" :key="item.id">
      <ItemCard :item="item" />
    </NGridItem>

    <NGridItem>
      <NewItem />
    </NGridItem>
  </NGrid>
</template>
