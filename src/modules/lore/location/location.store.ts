import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import type { ILocation } from './location.types';
import { useProjectStore } from '@/modules/project/project.store';

export const LOCATION_STORE = 'location';

export const usePrivateLocationStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${LOCATION_STORE}`,
  () => {
    const locations = ref<ILocation[]>([]);
    const projectStore = useProjectStore();

    // Загрузка локаций
    const loadLocations = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const locationsPath = `${projectStore.currentProject.path}/locations.json`;
        const exists = await fs.exists(locationsPath);

        if (!exists) {
          await fs.writeTextFile(locationsPath, JSON.stringify([], null, 2));
        }

        const locationsJson = await fs.readTextFile(locationsPath);
        locations.value = JSON.parse(locationsJson);
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    };

    // Сохранение локаций
    const saveLocations = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/locations.json`,
          JSON.stringify(locations.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving locations:', error);
      }
    };

    // Методы работы с локациями
    const addLocation = (location: ILocation) => {
      locations.value.push({
        ...location,
        id: crypto.randomUUID()
      });
    };

    const updateLocation = (location: ILocation) => {
      const index = locations.value.findIndex((loc) => loc.id === location.id);
      if (index !== -1) {
        locations.value[index] = location;
      }
    };

    const removeLocation = (locationId: string) => {
      const index = locations.value.findIndex((loc) => loc.id === locationId);
      if (index !== -1) {
        locations.value.splice(index, 1);
      }
    };

    // Следим за изменениями проекта
    watch(() => projectStore.currentProject?.path, loadLocations, { immediate: true });

    // Следим за изменениями локаций
    watch(locations, saveLocations, { deep: true });

    return {
      locations,
      addLocation,
      updateLocation,
      removeLocation
    };
  }
);
