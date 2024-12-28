import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IEvent } from './event.types';

export const EVENT_STORE = 'event';

export const usePrivateEventStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${EVENT_STORE}`,
  () => {
    const events = ref<IEvent[]>([]);

    return {
      events,
    };
  }
);
