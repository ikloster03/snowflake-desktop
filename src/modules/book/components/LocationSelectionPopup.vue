<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { NCard, NList, NListItem, NInput, NEmpty, NIcon } from 'naive-ui';
import { MapPin } from '@vicons/tabler';
import { usePrivateLocationStore } from '@/modules/lore/location/location.store';
import type { ILocation } from '@/modules/lore/location/location.types';
import { useI18n } from 'vue-i18n';

interface Props {
  visible: boolean;
  position: { x: number; y: number };
  selectedText: string;
}

interface Emits {
  (e: 'close'): void;
  (e: 'select', location: ILocation): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const locationStore = usePrivateLocationStore();
const searchQuery = ref('');
const listRef = ref<HTMLElement>();

const filteredLocations = computed(() => {
  const locations = locationStore.locations;
  console.log('Все локации:', locations);
  console.log('Поисковый запрос:', searchQuery.value);

  if (!searchQuery.value) {
    return locations;
  }
  const filtered = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log('Отфильтрованные локации:', filtered);
  return filtered;
});

const popupStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  zIndex: 1001,
  maxWidth: '300px',
  maxHeight: '400px',
}));

const selectLocation = (location: ILocation) => {
  console.log('Выбрана локация:', location);
  emit('select', location);
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
      const input = document.querySelector('.location-search-input input') as HTMLInputElement;
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
      class="location-selection-popup"
      @keydown="handleKeydown"
      @click.stop
    >
      <NCard size="small" class="popup-card" @click.stop>
        <template #header>
          <div class="popup-header">
            <span>{{ t('book.location.add') }}</span>
            <div class="selected-text" v-if="selectedText">
              "{{ selectedText }}"
            </div>
          </div>
        </template>

        <div class="popup-content">
          <NInput
            v-model:value="searchQuery"
            :placeholder="t('book.location.searchPlaceholder')"
            clearable
            class="location-search-input"
            @keydown="handleKeydown"
          />

          <div class="locations-list" v-if="filteredLocations.length > 0">
            <NList ref="listRef" clickable>
              <NListItem
                v-for="location in filteredLocations"
                :key="location.id"
                class="location-item"
                @click.stop="selectLocation(location)"
              >
                <template #prefix>
                  <NIcon size="18">
                    <MapPin />
                  </NIcon>
                </template>
                <div class="location-info" @click.stop="selectLocation(location)">
                  <div class="location-name">{{ location.name }}</div>
                  <div class="location-description" v-if="location.description">
                    {{ location.description.substring(0, 50) }}{{ location.description.length > 50 ? '...' : '' }}
                  </div>
                </div>
              </NListItem>
            </NList>
          </div>

          <NEmpty v-else :description="t('book.location.notFound')" />
        </div>
      </NCard>
    </div>
  </Teleport>
</template>

<style scoped>
.location-selection-popup {
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

.locations-list {
  max-height: 250px;
  overflow-y: auto;
}

.location-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.location-item:hover {
  background-color: var(--hover-color);
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-name {
  font-weight: 500;
  color: var(--text-color-1);
}

.location-description {
  font-size: 12px;
  color: var(--text-color-3);
  line-height: 1.4;
}

.location-search-input {
  margin-bottom: 8px;
}
</style>
