<script lang="ts" setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { NCard, NList, NListItem, NInput, NEmpty, NIcon } from 'naive-ui';
import { Calendar } from '@vicons/tabler';
import { useI18n } from 'vue-i18n';
import { usePrivateEventStore } from '@/modules/lore/event/event.store';
import type { IEvent } from '@/modules/lore/event/event.types';

interface Props {
  visible: boolean;
  position: { x: number; y: number };
  selectedText: string;
}

interface Emits {
  (e: 'select', event: IEvent): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const eventStore = usePrivateEventStore();
const searchQuery = ref('');
const listRef = ref<HTMLElement>();

const filteredEvents = computed(() => {
  const events = eventStore.events;
  console.log('Все события:', events);
  console.log('Поисковый запрос:', searchQuery.value);

  if (!searchQuery.value) {
    return events;
  }
  const filtered = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log('Отфильтрованные события:', filtered);
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

const selectEvent = (event: IEvent) => {
  console.log('Выбрано событие:', event);
  emit('select', event);
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
      const input = document.querySelector('.event-search-input input') as HTMLInputElement;
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
      class="event-selection-popup"
      @keydown="handleKeydown"
      @click.stop
    >
      <NCard size="small" class="popup-card" @click.stop>
        <template #header>
          <div class="popup-header">
            <span>{{ t('book.event.add') }}</span>
            <div class="selected-text" v-if="selectedText">
              "{{ selectedText }}"
            </div>
          </div>
        </template>

        <div class="popup-content">
          <NInput
            v-model:value="searchQuery"
            :placeholder="t('book.event.searchPlaceholder')"
            clearable
            class="event-search-input"
            @keydown="handleKeydown"
          />

          <div class="events-list" v-if="filteredEvents.length > 0">
            <NList ref="listRef" clickable>
              <NListItem
                v-for="event in filteredEvents"
                :key="event.id"
                class="event-item"
                @click.stop="selectEvent(event)"
              >
                <template #prefix>
                  <NIcon size="18">
                    <Calendar />
                  </NIcon>
                </template>
                <div class="event-info" @click.stop="selectEvent(event)">
                  <div class="event-name">{{ event.title || event.name }}</div>
                  <div class="event-description" v-if="event.description">
                    {{ event.description.substring(0, 50) }}{{ event.description.length > 50 ? '...' : '' }}
                  </div>
                </div>
              </NListItem>
            </NList>
          </div>

          <NEmpty v-else-if="eventStore.events.length === 0" description="События не созданы. Создайте события в разделе Лор проекта." />
          <NEmpty v-else :description="t('book.event.notFound')" />
        </div>
      </NCard>
    </div>
  </Teleport>
</template>

<style scoped>
.event-selection-popup {
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

.events-list {
  max-height: 250px;
  overflow-y: auto;
}

.event-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.event-item:hover {
  background-color: var(--hover-color);
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  cursor: pointer;
}

.event-name {
  font-weight: 500;
  color: var(--text-color-1);
}

.event-description {
  font-size: 12px;
  color: var(--text-color-3);
  line-height: 1.4;
}
</style>
