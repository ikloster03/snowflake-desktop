<script lang="ts" setup>
import { NGrid, NGridItem } from 'naive-ui';
import { usePrivateEventStore } from './event.store';
import Event from './Event.vue';
import NewEvent from './NewEvent.vue';
import type { IEvent } from './event.types';

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
</script>

<template>
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
</template>

<style scoped>
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
