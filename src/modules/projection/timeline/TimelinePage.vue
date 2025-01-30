<script lang="ts" setup>
import { NCard, NTimeline, NTimelineItem, NButton } from 'naive-ui';
import type { IEvent } from '@/modules/lore/event/event.types';
import { ref } from 'vue';

const EVENT_TYPE_MAP = {
  battle: 'warning',
  meeting: 'info',
  journey: 'success',
  other: 'default',
} as const;

const events: IEvent[] = [
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
];

// Функция для добавления нового события
const newEvent = ref<IEvent | null>(null);

const handleAddEvent = () => {
  if (newEvent.value) {
    events.push({ ...newEvent.value, id: crypto.randomUUID() });
    newEvent.value = null; // Сбросить новое событие после добавления
  }
};
</script>

<template>
  <NCard>
    <NTimeline>
      <NTimelineItem
        v-for="event in events"
        :key="event.title"
        :title="event.title"
        :content="event.description"
        :time="event.time"
        :type="EVENT_TYPE_MAP[event.type]"
      />
    </NTimeline>
    <NButton type="primary" class="float-button" @click="handleAddEvent">
      Добавить событие
    </NButton>
  </NCard>
</template>

<style scoped>
.float-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 1000; /* Убедитесь, что кнопка поверх других элементов */
}
</style>
