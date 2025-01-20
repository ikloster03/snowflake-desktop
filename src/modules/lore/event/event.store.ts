import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IEvent } from './event.types';

export const EVENT_STORE = 'event';

export const usePrivateEventStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${EVENT_STORE}`,
  () => {
    const events = ref<IEvent[]>([]);

    const addEvent = (event: IEvent) => {
      events.value.push({
        ...event,
        id: crypto.randomUUID()
      });
    };

    const updateEvent = (event: IEvent) => {
      const index = events.value.findIndex((e) => e.id === event.id);
      if (index !== -1) {
        events.value[index] = event;
      }
    };

    const removeEvent = (id: string) => {
      const index = events.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        events.value.splice(index, 1);
      }
    };

    return {
      events,
      addEvent,
      updateEvent,
      removeEvent
    };
  }
);
