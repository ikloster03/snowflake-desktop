<script lang="ts" setup>
import { NCard, NSpace, NTag, NButton, NTooltip } from 'naive-ui';
import { usePrivateItemStore } from './item.store';
import type { IItem } from './item.types';

const props = defineProps<{
  item: IItem;
}>();

const store = usePrivateItemStore();

const rarityColors = {
  common: 'default',
  uncommon: 'success',
  rare: 'info',
  legendary: 'warning',
} as const;

const typeLabels = {
  weapon: 'Оружие',
  armor: 'Броня',
  artifact: 'Артефакт',
  consumable: 'Расходник',
  quest: 'Квестовый',
  other: 'Другое',
} as const;
</script>

<template>
  <NCard hoverable>
    <template #header>
      <div class="item-header">
        <h3 class="item-name">{{ item.name }}</h3>
        <NTag :type="item.rarity ? rarityColors[item.rarity] : 'default'">
          {{ item.rarity || 'обычный' }}
        </NTag>
      </div>
    </template>

    <div class="item-type">
      {{ typeLabels[item.type] }}
    </div>

    <p class="item-description">{{ item.description }}</p>

    <template v-if="item.properties?.length">
      <div class="item-properties">
        <NSpace>
          <NTag v-for="prop in item.properties" :key="prop" size="small">
            {{ prop }}
          </NTag>
        </NSpace>
      </div>
    </template>

    <template #footer>
      <NSpace justify="end">
        <NButton size="small" type="error" @click="store.removeItem(item.id)">
          Удалить
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>

<style scoped>
.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.item-name {
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
}

.item-type {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.item-description {
  margin: 8px 0;
  font-size: 0.9rem;
}

.item-properties {
  margin-top: 8px;
}
</style>
