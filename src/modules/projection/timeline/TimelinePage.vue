<script lang="ts" setup>
import { NCard, NTimeline, NTimelineItem } from 'naive-ui';
import type { IEvent } from '@/modules/lore/event/event.types';

const events: IEvent[] = [
  {
    title: 'Событие 1',
    description: 'Описание первого события',
    time: '2024-03-20 12:00',
    type: 'success'
  },
  {
    title: 'Событие 2',
    description: 'Описание второго события',
    time: '2024-03-21 15:30',
    type: 'info'
  },
  {
    title: 'Событие 3',
    description: 'Описание третьего события',
    time: '2024-03-22 09:45',
    type: 'warning'
  }
];
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
        :type="event.type"
      />
    </NTimeline>
  </NCard>
</template>

<style scoped></style>
