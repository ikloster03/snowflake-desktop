<script lang="ts" setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { NCard, NList, NListItem, NInput, NEmpty, NIcon, NBadge } from 'naive-ui';
import {
  Package,
  Shield,
  Tool,
  Diamond,
  Book,
  Box
} from '@vicons/tabler';
import { useI18n } from 'vue-i18n';
import { usePrivateItemStore } from '@/modules/lore/item/item.store';
import type { IItem } from '@/modules/lore/item/item.types';
import { useBookStore } from '../book.store';
import type { StageID } from '@/core/id';

interface Props {
  visible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  currentStageId?: StageID | null;
}

interface Emits {
  (e: 'select', item: IItem): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const itemStore = usePrivateItemStore();
const bookStore = useBookStore();

const searchQuery = ref('');
const listRef = ref<HTMLElement>();

// Получаем доступные предметы в зависимости от контекста сцены
const availableItems = computed(() => {
  console.log('ItemSelectionPopup: currentStageId:', props.currentStageId);

  if (props.currentStageId) {
    const stageItems = bookStore.getStageItems(props.currentStageId);
    console.log('ItemSelectionPopup: stageItems:', stageItems);
    return stageItems;
  }

  console.log('ItemSelectionPopup: all items:', itemStore.items);
  return itemStore.items;
});

const filteredItems = computed(() => {
  console.log('ItemSelectionPopup: availableItems:', availableItems.value);
  console.log('ItemSelectionPopup: searchQuery:', searchQuery.value);

  if (!searchQuery.value) {
    console.log('ItemSelectionPopup: no search query, returning all available items');
    return availableItems.value;
  }

  const filtered = availableItems.value.filter((item: IItem) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  console.log('ItemSelectionPopup: filtered items:', filtered);
  return filtered;
});

const popupStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  zIndex: 1001,
  maxWidth: '350px',
  maxHeight: '400px',
}));

const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case 'common': return '#6b7280';
    case 'uncommon': return '#10b981';
    case 'rare': return '#3b82f6';
    case 'legendary': return '#f59e0b';
    default: return '#6b7280';
  }
};

const getTypeIcon = (type: IItem['type']) => {
  switch (type) {
    case 'weapon': return Tool;
    case 'armor': return Shield;
    case 'consumable': return Package;
    case 'quest': return Book;
    case 'artifact': return Diamond;
    case 'other': return Box;
    default: return Package;
  }
};

const selectItem = (item: IItem) => {
  console.log('Выбран предмет:', item);
  emit('select', item);
};

const closePopup = () => {
  console.log('Закрытие попапа');
  emit('close');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closePopup();
  }
};

// Фокус на поле поиска при открытии
watch(() => props.visible, (visible) => {
  if (visible) {
    nextTick(() => {
      const input = document.querySelector('.item-search-input input') as HTMLInputElement;
      input?.focus();

      // Добавляем обработчик для глобальных клавиш
      document.addEventListener('keydown', handleGlobalKeydown);
    });
  } else {
    searchQuery.value = '';

    // Удаляем обработчик
    document.removeEventListener('keydown', handleGlobalKeydown);
  }
});

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePopup();
  }
};

// Очистка при размонтировании
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :style="popupStyle"
      class="item-selection-popup"
      @keydown="handleKeydown"
      @click.stop
    >
      <NCard size="small" class="popup-card" @click.stop>
        <template #header>
          <div class="popup-header">
            <span>{{ t('book.item.add') }}</span>
            <div class="selected-text" v-if="selectedText">
              "{{ selectedText }}"
            </div>
          </div>
        </template>

        <div class="popup-content">
          <NInput
            v-model:value="searchQuery"
            :placeholder="t('book.item.searchPlaceholder')"
            clearable
            class="item-search-input"
            @keydown="handleKeydown"
          />

          <div class="items-list" v-if="filteredItems.length > 0">
            <NList ref="listRef" clickable>
              <NListItem
                v-for="item in filteredItems"
                :key="item.id"
                class="item-item"
                @click.stop="selectItem(item)"
              >
                <template #prefix>
                  <NIcon size="18" :color="getRarityColor(item.rarity)">
                    <component :is="getTypeIcon(item.type)" />
                  </NIcon>
                </template>
                <div class="item-info" @click.stop="selectItem(item)">
                  <div class="item-header">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-badges">
                      <NBadge
                        v-if="item.rarity"
                        :color="getRarityColor(item.rarity)"
                        size="small"
                        class="rarity-badge"
                      >
                        {{ item.rarity }}
                      </NBadge>
                      <NBadge
                        color="#6b7280"
                        size="small"
                        class="type-badge"
                      >
                        {{ item.type }}
                      </NBadge>
                    </div>
                  </div>
                  <div class="item-description" v-if="item.description">
                    {{ item.description.substring(0, 80) }}{{ item.description.length > 80 ? '...' : '' }}
                  </div>
                </div>
              </NListItem>
            </NList>
          </div>

          <!-- Если предметы не найдены -->
          <NEmpty v-if="itemStore.items.length === 0" class="popup-empty">
            <template #icon>
              <NIcon size="48" :color="'#8B8B8B'">
                <Package />
              </NIcon>
            </template>
            <template #description>
              {{ t('modules.book.empty.noItems') }}
            </template>
          </NEmpty>

          <NEmpty v-else-if="props.currentStageId && availableItems.length === 0" class="popup-empty">
            <template #icon>
              <NIcon size="48" :color="'#8B8B8B'">
                <Package />
              </NIcon>
            </template>
            <template #description>
              {{ t('modules.book.empty.noAssignedItems') }}
            </template>
          </NEmpty>

          <NEmpty v-else-if="filteredItems.length === 0" class="popup-empty">
            <template #icon>
              <NIcon size="48" :color="'#8B8B8B'">
                <Package />
              </NIcon>
            </template>
            <template #description>
              {{ t('modules.book.empty.itemsNotFound') }}
            </template>
          </NEmpty>
        </div>
      </NCard>
    </div>
  </Teleport>
</template>

<style scoped>
.item-selection-popup {
  pointer-events: all;
}

.popup-card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.popup-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-text {
  font-size: 12px;
  color: var(--text-color-3);
  font-style: italic;
  background-color: var(--code-color);
  padding: 4px 8px;
  border-radius: 4px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.items-list {
  max-height: 250px;
  overflow-y: auto;
}

.item-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.item-item:hover {
  background-color: var(--hover-color);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.item-name {
  font-weight: 500;
  color: var(--text-color-1);
  flex: 1;
}

.item-badges {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.rarity-badge,
.type-badge {
  text-transform: capitalize;
  font-size: 10px;
}

.item-description {
  font-size: 12px;
  color: var(--text-color-3);
  line-height: 1.4;
}

.item-search-input {
  margin-bottom: 8px;
}

.popup-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
