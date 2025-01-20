import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ILocation } from './location.types';

export const LOCATION_STORE = 'location';

export const usePrivateLocationStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${LOCATION_STORE}`,
  () => {
    const locations = ref<ILocation[]>([]);

    const addLocation = (location: ILocation) => {
      locations.value.push(location);
    };

    const updateLocation = (index: number, location: ILocation) => {
      locations.value[index] = location;
    };

    const removeLocation = (locationId: string) => {
      const index = locations.value.findIndex((loc) => loc.id === locationId);
      if (index !== -1) {
        locations.value.splice(index, 1);
      }
    };

    return {
      locations,
      addLocation,
      updateLocation,
      removeLocation,
    };
  }
);
