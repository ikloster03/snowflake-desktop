<script lang="ts" setup>
import { NGrid, NGridItem, NButton } from 'naive-ui';
import { ref } from 'vue';
import { usePrivateEventStore } from './event.store';
import Event from './Event.vue';
import NewEvent from './NewEvent.vue';
import type { IEvent } from './event.types';

const eventStore = usePrivateEventStore();
const showNewEventForm = ref(false);

const handleEventUpdate = (updatedEvent: IEvent, index: number) => {
  eventStore.events[index] = updatedEvent;
};

const handleEventCreate = (newEvent: IEvent) => {
  eventStore.events.push(newEvent);
  showNewEventForm.value = false;
};
</script>

<template>
  <NGrid :cols="3" :x-gap="16" :y-gap="16">
    <NGridItem v-for="(event, index) in eventStore.events" :key="index">
      <Event :event="event" @update="(updatedEvent) => handleEventUpdate(updatedEvent, index)" />
    </NGridItem>

    <NGridItem>
      <div v-if="!showNewEventForm" class="add-event-card">
        <NButton type="primary" @click="showNewEventForm = true">
          Добавить событие
        </NButton>
      </div>
      <NewEvent v-else @create="handleEventCreate" />
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
