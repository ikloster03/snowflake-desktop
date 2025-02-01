<script lang="ts" setup>
import { NCard, NTimeline, NTimelineItem, NButton, NIcon, NModal, NForm, NFormItem, NInput, NDatePicker, NSelect } from 'naive-ui';
import type { IEvent } from '@/modules/lore/event/event.types';
import { ref } from 'vue';
import { Add12Regular as Add } from '@vicons/fluent';
import type { Value as DatePickerValue } from 'naive-ui/es/date-picker/src/interface';

const EVENT_TYPE_MAP = {
  battle: 'warning',
  meeting: 'info',
  journey: 'success',
  other: 'default',
} as const;

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
  type: 'other'
});

const typeOptions = [
  { label: 'Битва', value: 'battle' },
  { label: 'Встреча', value: 'meeting' },
  { label: 'Путешествие', value: 'journey' },
  { label: 'Другое', value: 'other' }
];

const handleAddEvent = () => {
  if (!newEvent.value.time) return;

  events.value.push({
    ...newEvent.value,
    id: crypto.randomUUID(),
    time: new Date(newEvent.value.time as number).toISOString()
  });

  showModal.value = false;
  newEvent.value = {
    id: '',
    title: '',
    description: '',
    time: null,
    type: 'other'
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
</script>

<template>
  <NCard>
    <NTimeline>
      <NTimelineItem
        v-for="(event, index) in events"
        :key="event.id"
        :title="event.title"
        :content="event.description"
        :time="event.time"
        :type="EVENT_TYPE_MAP[event.type]"
        draggable="true"
        class="timeline-item"
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
          <NInput v-model:value="newEvent.title" placeholder="Введите название события" />
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

        <div class="modal-footer">
          <NButton type="primary" @click="handleAddEvent">Создать</NButton>
          <NButton @click="showModal = false">Отмена</NButton>
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
  cursor: move;
  transition: background-color 0.2s;
}

.timeline-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
