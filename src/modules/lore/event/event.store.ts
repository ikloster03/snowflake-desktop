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
      events.value.push(event);
    };

    const updateEvent = (index: number, event: IEvent) => {
      events.value[index] = event;
    };

    return {
      events,
      addEvent,
      updateEvent
    };
  }
);
