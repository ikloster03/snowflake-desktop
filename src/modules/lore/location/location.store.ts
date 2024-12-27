import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ILocation } from './location.types';

export const LOCATION_STORE = 'location';

export const usePrivateLocationStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${LOCATION_STORE}`,
  () => {
    const locations = ref<ILocation[]>([]);

    return {
      locations,
    };
  }
);
