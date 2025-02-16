<script lang="ts" setup>
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { NCard, NGrid, NGridItem, NProgress } from 'naive-ui';
import { computed } from 'vue';
import { usePrivateItemStore } from './item.store';
import ItemCard from './ItemCard.vue';
import NewItem from './NewItem.vue';

const store = usePrivateItemStore();

const itemsProgress = computed(() => ({
  percentage: (store.items.length / PROJECT_LIMITS.ITEMS.MAX_ITEMS_PER_PROJECT) * 100,
  current: store.items.length,
  max: PROJECT_LIMITS.ITEMS.MAX_ITEMS_PER_PROJECT
}));
</script>

<template>
  <div class="items-container">
    <div class="items-header">
      <h2>Предметы</h2>
      <div class="items-limit">
        <span class="limit-text">{{ itemsProgress.current }} / {{ itemsProgress.max }}</span>
        <NProgress
          type="line"
          :percentage="itemsProgress.percentage"
          :height="12"
          :border-radius="6"
          :color="itemsProgress.percentage >= 90 ? '#d03050' : undefined"
          class="limit-progress"
        />
      </div>
    </div>

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
        <NewItem v-if="store.canAddItem" />
        <NCard v-else class="limit-card">
          <div class="limit-message">
            Достигнут лимит предметов ({{ PROJECT_LIMITS.ITEMS.MAX_ITEMS_PER_PROJECT }})
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
.items-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.items-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color-base);
}

.items-limit {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.limit-text {
  font-size: 0.9rem;
  color: var(--text-color-3);
  white-space: nowrap;
}

.limit-progress {
  flex: 1;
  min-width: 100px;
}
</style>
