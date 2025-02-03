<script lang="ts" setup>
import {
  NCard,
  NTimeline,
  NTimelineItem,
  NButton,
  NIcon,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  NSelect,
} from 'naive-ui';
import type { IEvent } from '@/modules/lore/event/event.types';
import { ref, computed } from 'vue';
import { Add12Regular as Add } from '@vicons/fluent';
import type { Value as DatePickerValue } from 'naive-ui/es/date-picker/src/interface';

const EVENT_TYPE_MAP = {
  battle: 'warning',
  meeting: 'info',
  journey: 'success',
  other: 'default',
} as const;

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

const stages = [
  {
    id: '1-1',
    title: 'Этап 1: Пробуждение героя',
    chapterId: '1',
  },
  {
    id: '1-2',
    title: 'Этап 2: Встреча с наставником',
    chapterId: '1',
  },
  {
    id: '2-1',
    title: 'Этап 1: В дороге',
    chapterId: '2',
  },
  {
    id: '2-2',
    title: 'Этап 2: Первое испытание',
    chapterId: '2',
  },
];

const events = ref<IEvent[]>([
  {
    id: 'event1',
    title: 'Событие 1',
    description: 'Описание первого события',
    time: '2024-03-20 12:00',
    type: 'battle',
  },
  {
    id: 'event2',
    title: 'Событие 2',
    description: 'Описание второго события',
    time: '2024-03-21 15:30',
    type: 'meeting',
  },
  {
    id: 'event3',
    title: 'Событие 3',
    description: 'Описание третьего события',
    time: '2024-03-22 09:45',
    type: 'journey',
  },
]);

const showModal = ref(false);

const newEvent = ref<Omit<IEvent, 'time'> & { time: DatePickerValue | null }>({
  id: '',
  title: '',
  description: '',
  time: null,
  type: 'other',
  chapterId: undefined,
  stageId: undefined,
});

const typeOptions = [
  { label: 'Битва', value: 'battle' },
  { label: 'Встреча', value: 'meeting' },
  { label: 'Путешествие', value: 'journey' },
  { label: 'Другое', value: 'other' },
];

const chapterOptions = chapters.map((chapter) => ({
  label: chapter.title,
  value: chapter.id,
}));

const stageOptions = stages.map((stage) => ({
  label: stage.title,
  value: stage.id,
  chapterId: stage.chapterId,
}));

const handleStageSelect = (stageId: string) => {
  const selectedStage = stages.find((stage) => stage.id === stageId);
  if (selectedStage) {
    newEvent.value.stageId = stageId;
    newEvent.value.chapterId = selectedStage.chapterId;
  }
};

const handleAddEvent = () => {
  if (!newEvent.value.time) return;

  events.value.push({
    ...newEvent.value,
    id: crypto.randomUUID(),
    time: new Date(newEvent.value.time as number).toISOString(),
  });

  showModal.value = false;
  newEvent.value = {
    id: '',
    title: '',
    description: '',
    time: null,
    type: 'other',
    chapterId: undefined,
    stageId: undefined,
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

  const selectedStage = stages.find((stage) => stage.id === stageId);
  if (selectedStage) {
    editingEvent.value.stageId = stageId;
    editingEvent.value.chapterId = selectedStage.chapterId;
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
          ${event.stageId ? '\n\nЭтап: ' + stages.find((s) => s.id === event.stageId)?.title : ''}
          ${event.chapterId ? '\nГлава: ' + chapters.find((c) => c.id === event.chapterId)?.title : ''}`"
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
            placeholder="Выберите этап"
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
  transition: background-color 0.2s;
}

.timeline-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.timeline-item :deep(.n-timeline-item-content) {
  white-space: pre-line;
}
</style>
