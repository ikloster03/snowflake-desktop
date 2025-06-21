<script lang="ts" setup>
import { createID } from '@/core/id';
import { EVENT_TYPE_MAP } from '@/modules/lore/event/event.const';
import type { IEvent } from '@/modules/lore/event/event.types';
import { Add12Regular as Add } from '@vicons/fluent';
import {
  NButton,
  NCard,
  NDatePicker,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NModal,
  NSelect,
  NTimeline,
  NTimelineItem,
  useMessage,
} from 'naive-ui';
import type { Value as DatePickerValue } from 'naive-ui/es/date-picker/src/interface';
import { computed, ref, onMounted } from 'vue';
import { usePrivateEventStore } from '@/modules/lore/event/event.store';
import { useBookStore } from '@/modules/book/book.store';

const message = useMessage();
const bookStore = useBookStore();
const eventStore = usePrivateEventStore();

// Загрузка данных при монтировании компонента
onMounted(() => {
  eventStore.loadEvents();
  bookStore.loadChapters();
  bookStore.loadStages();
});

// Возможность сортировать события по времени
const sortedEvents = computed(() => {
  return [...eventStore.events].sort((a, b) => {
    return a.order - b.order;
  });
});

const stageOptions = computed(() =>
  bookStore.stages.map((stage) => ({
    label: stage.title,
    value: stage.id,
    chapterId: stage.chapterId,
  }))
);

const getStageById = (stageId?: string) => {
  if (!stageId) return null;
  return bookStore.stages.find((stage) => stage.id === stageId) || null;
};

const getChapterById = (chapterId?: string) => {
  if (!chapterId) return null;
  return bookStore.chapters.find((chapter) => chapter.id === chapterId) || null;
};

const getCharacterById = (characterId: string) => {
  // В будущем можно заменить на реальный источник персонажей
  return bookStore.authors.find((author) => author.id === characterId) || null;
};

const showModal = ref(false);

const newEvent = ref<Omit<IEvent, 'time'> & { time: DatePickerValue | null }>({
  id: createID<'Event'>(),
  order: 0,
  title: '',
  name: '',
  description: '',
  time: null,
  type: 'other',
  chapterId: undefined,
  stageId: undefined,
  characterIds: [],
});

const typeOptions = [
  { label: 'Битва', value: 'battle' },
  { label: 'Встреча', value: 'meeting' },
  { label: 'Путешествие', value: 'journey' },
  { label: 'Другое', value: 'other' },
];

const handleStageSelect = (stageId: string) => {
  const selectedStage = getStageById(stageId);
  if (selectedStage) {
    newEvent.value.stageId = selectedStage.id;
    newEvent.value.chapterId = selectedStage.chapterId;
    newEvent.value.characterIds = selectedStage.characterIds || [];
  }
};

const handleAddEvent = () => {
  if (!newEvent.value.time) {
    message.warning('Необходимо указать время события');
    return;
  }

  if (!newEvent.value.title) {
    message.warning('Необходимо указать название события');
    return;
  }

  const eventToAdd: IEvent = {
    ...newEvent.value,
    id: createID<'Event'>(),
    time: new Date(newEvent.value.time as number).toISOString(),
  };

  eventStore.addEvent(eventToAdd);
  eventStore.saveEvents();

  showModal.value = false;
  newEvent.value = {
    id: createID<'Event'>(),
    order: 0,
    title: '',
    name: '',
    description: '',
    time: null,
    type: 'other',
    chapterId: undefined,
    stageId: undefined,
    characterIds: [],
  };
};

const openModal = () => {
  showModal.value = true;
};

const handleDragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', index.toString());
  }
};

const handleDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();
  const sourceIndex = Number(event.dataTransfer?.getData('text/plain'));
  if (!isNaN(sourceIndex)) {
    const events = [...sortedEvents.value];
    const [movedEvent] = events.splice(sourceIndex, 1);
    events.splice(targetIndex, 0, movedEvent);

    // В будущем можно добавить обработку изменения порядка в сторе
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const editingEvent = ref<
  (Omit<IEvent, 'time'> & { time: DatePickerValue | null }) | null
>(null);
const showEditModal = ref(false);

const handleEditClick = (event: IEvent) => {
  editingEvent.value = {
    ...event,
    time: new Date(event.time).getTime(),
  };
  showEditModal.value = true;
};

const handleEditSave = () => {
  if (!editingEvent.value?.time) {
    message.warning('Необходимо указать время события');
    return;
  }

  const updatedEvent: IEvent = {
    ...editingEvent.value,
    time: new Date(editingEvent.value.time as number).toISOString(),
  };

  eventStore.updateEvent(updatedEvent);
  eventStore.saveEvents();

  showEditModal.value = false;
  editingEvent.value = null;
};

const handleEditStageSelect = (stageId: string) => {
  if (!editingEvent.value) return;

  const selectedStage = getStageById(stageId);
  if (selectedStage) {
    editingEvent.value.stageId = selectedStage.id;
    editingEvent.value.chapterId = selectedStage.chapterId;
    editingEvent.value.characterIds = selectedStage.characterIds || [];
  }
};

const handleDeleteEvent = (eventId: string) => {
  eventStore.removeEvent(eventId);
  eventStore.saveEvents();
};
</script>

<template>
  <NCard>
    <NTimeline>
      <NTimelineItem
        v-for="(event, index) in sortedEvents"
        :key="event.id"
        :title="event.title"
        :content="`${event.description}
          ${event.stageId ? '\n\nСцена: ' + (getStageById(event.stageId)?.title || 'Неизвестная сцена') : ''}
          ${event.chapterId ? '\nГлава: ' + (getChapterById(event.chapterId)?.title || 'Неизвестная глава') : ''}
          ${
            event.characterIds?.length
              ? '\nПерсонажи: ' +
                event.characterIds
                  .map((id) => getCharacterById(id)?.firstName || 'Неизвестный персонаж')
                  .join(', ')
              : ''
          }`"
        :time="new Date(event.time).toLocaleString()"
        :type="EVENT_TYPE_MAP[event.type]"
        draggable="true"
        class="timeline-item"
        @click="handleEditClick(event)"
        @dragstart="handleDragStart($event, index)"
        @drop="handleDrop($event, index)"
        @dragover="handleDragOver"
      />
    </NTimeline>

    <NButton circle type="primary" class="float-button" @click="openModal">
      <NIcon>
        <Add />
      </NIcon>
    </NButton>

    <NModal v-model:show="showModal" preset="card" title="Создать событие">
      <NForm>
        <NFormItem label="Название">
          <NInput
            v-model:value="newEvent.title"
            placeholder="Введите название события"
          />
        </NFormItem>

        <NFormItem label="Описание">
          <NInput
            v-model:value="newEvent.description"
            type="textarea"
            placeholder="Введите описание события"
          />
        </NFormItem>

        <NFormItem label="Время">
          <NDatePicker
            v-model:value="newEvent.time"
            type="datetime"
            placeholder="Выберите дату и время"
          />
        </NFormItem>

        <NFormItem label="Тип">
          <NSelect
            v-model:value="newEvent.type"
            :options="typeOptions"
            placeholder="Выберите тип события"
          />
        </NFormItem>

        <NFormItem label="Сцена">
          <NSelect
            v-model:value="newEvent.stageId"
            :options="stageOptions"
            placeholder="Выберите сцену"
            @update:value="handleStageSelect"
          />
        </NFormItem>

        <NFormItem label="Глава" v-if="newEvent.chapterId">
          <NInput
            :value="getChapterById(newEvent.chapterId)?.title || 'Неизвестная глава'"
            readonly
            disabled
          />
        </NFormItem>

        <NFormItem label="Персонажи" v-if="newEvent.characterIds?.length">
          <NInput
            :value="
              newEvent.characterIds
                .map((id) => getCharacterById(id)?.firstName || 'Неизвестный персонаж')
                .join(', ')
            "
            readonly
            disabled
          />
        </NFormItem>

        <div class="modal-footer">
          <NButton type="primary" @click="handleAddEvent">Создать</NButton>
          <NButton @click="showModal = false">Отмена</NButton>
        </div>
      </NForm>
    </NModal>

    <NModal
      v-model:show="showEditModal"
      preset="card"
      title="Редактировать событие"
    >
      <NForm v-if="editingEvent">
        <NFormItem label="Название">
          <NInput
            v-model:value="editingEvent.title"
            placeholder="Введите название события"
          />
        </NFormItem>

        <NFormItem label="Описание">
          <NInput
            v-model:value="editingEvent.description"
            type="textarea"
            placeholder="Введите описание события"
          />
        </NFormItem>

        <NFormItem label="Время">
          <NDatePicker
            v-model:value="editingEvent.time"
            type="datetime"
            placeholder="Выберите дату и время"
          />
        </NFormItem>

        <NFormItem label="Тип">
          <NSelect
            v-model:value="editingEvent.type"
            :options="typeOptions"
            placeholder="Выберите тип события"
          />
        </NFormItem>

        <NFormItem label="Сцена">
          <NSelect
            v-model:value="editingEvent.stageId"
            :options="stageOptions"
            placeholder="Выберите сцену"
            @update:value="handleEditStageSelect"
          />
        </NFormItem>

        <NFormItem label="Глава" v-if="editingEvent.chapterId">
          <NInput
            :value="
              getChapterById(editingEvent.chapterId)?.title || 'Неизвестная глава'
            "
            readonly
            disabled
          />
        </NFormItem>

        <NFormItem label="Персонажи" v-if="editingEvent?.characterIds?.length">
          <NInput
            :value="
              editingEvent.characterIds
                .map((id) => getCharacterById(id)?.firstName || 'Неизвестный персонаж')
                .join(', ')
            "
            readonly
            disabled
          />
        </NFormItem>

        <div class="modal-footer">
          <NButton type="primary" @click="handleEditSave">Сохранить</NButton>
          <NButton @click="showEditModal = false">Отмена</NButton>
          <NButton type="error" @click="() => { if (editingEvent) { handleDeleteEvent(editingEvent.id); showEditModal = false; } }">
            Удалить
          </NButton>
        </div>
      </NForm>
    </NModal>
  </NCard>
</template>

<style scoped>
.float-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.timeline-item {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 6px;
  margin: 4px 0;
}

.timeline-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.timeline-item :deep(.n-timeline-item-content) {
  white-space: pre-line;
}

/* Добавляем стили для темной темы */
:deep(.n-timeline-item-content) {
  transition: background-color 0.2s ease;
}

:global(.dark-theme) .timeline-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}
</style>
