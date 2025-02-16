<script lang="ts" setup>
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { NGrid, NGridItem, NProgress } from 'naive-ui';
import { computed } from 'vue';
import { usePrivateEventStore } from './event.store';
import type { IEvent } from './event.types';
import Event from './Event.vue';
import NewEvent from './NewEvent.vue';

const eventStore = usePrivateEventStore();

const handleEventUpdate = (updatedEvent: IEvent) => {
  eventStore.updateEvent(updatedEvent);
};

const handleEventCreate = (newEvent: IEvent) => {
  eventStore.addEvent(newEvent);
};

const handleEventDelete = (id: string) => {
  eventStore.removeEvent(id);
};

const eventsProgress = computed(() => ({
  percentage: (eventStore.events.length / PROJECT_LIMITS.TIMELINE.MAX_EVENTS_PER_PROJECT) * 100,
  current: eventStore.events.length,
  max: PROJECT_LIMITS.TIMELINE.MAX_EVENTS_PER_PROJECT
}));
</script>

<template>
  <div class="events-container">
    <div class="events-header">
      <h2>События</h2>
      <div class="events-limit">
        <span class="limit-text">{{ eventsProgress.current }} / {{ eventsProgress.max }}</span>
        <NProgress
          type="line"
          :percentage="eventsProgress.percentage"
          :height="12"
          :border-radius="6"
          :color="eventsProgress.percentage >= 90 ? '#d03050' : undefined"
          class="limit-progress"
        />
      </div>
    </div>

    <NGrid :cols="3" :x-gap="16" :y-gap="16">
      <NGridItem v-for="event in eventStore.events" :key="event.id">
        <Event
          :event="event"
          @update="handleEventUpdate"
          @delete="() => handleEventDelete(event.id)"
        />
      </NGridItem>

      <NGridItem>
        <NewEvent @create="handleEventCreate" />
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
.events-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.events-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.events-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color-base);
}

.events-limit {
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

.add-event-card {
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
}
</style>
