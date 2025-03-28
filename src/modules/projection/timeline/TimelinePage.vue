<script lang="ts" setup>
import { createID } from '@/core/id';
import type { Character } from '@/modules/lore/character/character.types';
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
} from 'naive-ui';
import type { Value as DatePickerValue } from 'naive-ui/es/date-picker/src/interface';
import { computed, ref } from 'vue';
import { useStageStore } from '../stage/stage.store';

const chapters = [
  {
    id: '1',
    title: 'Глава 1: Начало пути',
  },
  {
    id: '2',
    title: 'Глава 2: Путешествие',
  },
];

const stageStore = useStageStore();

const stageOptions = computed(() =>
  stageStore.stages.map((stage) => ({
    label: stage.title,
    value: stage.id,
    chapterId: stage.chapterId,
  }))
);

const events = ref<IEvent[]>([
  {
    id: createID<'Event'>(),
    title: 'Событие 1',
    description: 'Описание первого события',
    time: '2024-03-20 12:00',
    type: 'battle',
  },
  {
    id: createID<'Event'>(),
    title: 'Событие 2',
    description: 'Описание второго события',
    time: '2024-03-21 15:30',
    type: 'meeting',
  },
  {
    id: createID<'Event'>(),
    title: 'Событие 3',
    description: 'Описание третьего события',
    time: '2024-03-22 09:45',
    type: 'journey',
  },
]);

const showModal = ref(false);

const characters: Character[] = [
  {
    id: createID<'Character'>(),
    name: 'Анна Каренина',
    description: 'Главная героиня',
    level: 'primary',
    type: 'protagonist',
  },
  {
    id: createID<'Character'>(),
    name: 'Алексей Вронский',
    description: 'Возлюбленный Анны',
    level: 'secondary',
    type: 'love interest',
  },
];

const newEvent = ref<Omit<IEvent, 'time'> & { time: DatePickerValue | null }>({
  id: createID<'Event'>(),
  title: '',
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
  const selectedStage = stageStore.getStageById(stageId);
  if (selectedStage) {
    newEvent.value.stageId = createID<'Stage'>(stageId);
    newEvent.value.chapterId = selectedStage.chapterId
      ? createID<'Chapter'>(selectedStage.chapterId)
      : undefined;
    newEvent.value.characterIds = selectedStage.characterIds.map((id) =>
      createID<'Character'>(id)
    );
  }
};

const handleAddEvent = () => {
  if (!newEvent.value.time) return;

  events.value.push({
    ...newEvent.value,
    id: createID<'Event'>(),
    time: new Date(newEvent.value.time as number).toISOString(),
  });

  showModal.value = false;
  newEvent.value = {
    id: createID<'Event'>(),
    title: '',
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
    const [movedEvent] = events.value.splice(sourceIndex, 1);
    events.value.splice(targetIndex, 0, movedEvent);
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
  if (!editingEvent.value?.time) return;

  const index = events.value.findIndex((e) => e.id === editingEvent.value?.id);
  if (index !== -1) {
    events.value[index] = {
      ...editingEvent.value,
      time: new Date(editingEvent.value.time as number).toISOString(),
    };
  }

  showEditModal.value = false;
  editingEvent.value = null;
};

const handleEditStageSelect = (stageId: string) => {
  if (!editingEvent.value) return;

  const selectedStage = stageStore.getStageById(stageId);
  if (selectedStage) {
    editingEvent.value.stageId = createID<'Stage'>(stageId);
    editingEvent.value.chapterId = selectedStage.chapterId
      ? createID<'Chapter'>(selectedStage.chapterId)
      : undefined;
    editingEvent.value.characterIds = selectedStage.characterIds.map((id) =>
      createID<'Character'>(id)
    );
  }
};
</script>

<template>
  <NCard>
    <NTimeline>
      <NTimelineItem
        v-for="(event, index) in events"
        :key="event.id"
        :title="event.title"
        :content="`${event.description}
          ${event.stageId ? '\n\nЭтап: ' + stageStore.getStageById(event.stageId)?.title : ''}
          ${event.chapterId ? '\nГлава: ' + chapters.find((c) => c.id === event.chapterId)?.title : ''}
          ${
            event.characterIds?.length
              ? '\nПерсонажи: ' +
                event.characterIds
                  .map((id) => characters.find((c) => c.id === id)?.name)
                  .join(', ')
              : ''
          }`"
        :time="event.time"
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

        <NFormItem label="Этап">
          <NSelect
            v-model:value="newEvent.stageId"
            :options="stageOptions"
            placeholder="Выберите сцену"
            @update:value="handleStageSelect"
          />
        </NFormItem>

        <NFormItem label="Глава" v-if="newEvent.chapterId">
          <NInput
            :value="chapters.find((c) => c.id === newEvent.chapterId)?.title"
            readonly
            disabled
          />
        </NFormItem>

        <NFormItem label="Персонажи" v-if="newEvent.characterIds?.length">
          <NInput
            :value="
              newEvent.characterIds
                .map((id) => characters.find((c) => c.id === id)?.name)
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

        <NFormItem label="Этап">
          <NSelect
            v-model:value="editingEvent.stageId"
            :options="stageOptions"
            placeholder="Выберите этап"
            @update:value="handleEditStageSelect"
          />
        </NFormItem>

        <NFormItem label="Глава" v-if="editingEvent.chapterId">
          <NInput
            :value="
              chapters.find((c) => c.id === editingEvent?.chapterId)?.title
            "
            readonly
            disabled
          />
        </NFormItem>

        <NFormItem label="Персонажи" v-if="editingEvent?.characterIds?.length">
          <NInput
            :value="
              editingEvent.characterIds
                .map((id) => characters.find((c) => c.id === id)?.name)
                .join(', ')
            "
            readonly
            disabled
          />
        </NFormItem>

        <div class="modal-footer">
          <NButton type="primary" @click="handleEditSave">Сохранить</NButton>
          <NButton @click="showEditModal = false">Отмена</NButton>
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
