import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import type { ILocation } from './location.types';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { createID } from '@/core/id';
// import { useMessage } from 'naive-ui';

export const LOCATION_STORE = 'location';

export const usePrivateLocationStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${LOCATION_STORE}`,
  () => {
    const locations = ref<ILocation[]>([]);
    const projectStore = useProjectStore();
    // const message = useMessage();

    const canAddLocation = computed(() =>
      locations.value.length < PROJECT_LIMITS.LOCATIONS.MAX_LOCATIONS_PER_PROJECT
    );

    // Загрузка локаций
    const loadLocations = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const locationsPath = `${projectStore.currentProject.path}/lore/locations.json`;
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
          `${projectStore.currentProject.path}/lore/locations.json`,
          JSON.stringify(locations.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving locations:', error);
      }
    };

    // Методы работы с локациями
    const addLocation = (location: ILocation) => {
      if (!canAddLocation.value) {
        // message.error(`Достигнут лимит локаций (${PROJECT_LIMITS.LOCATIONS.MAX_LOCATIONS_PER_PROJECT})`);
        return false;
      }

      if (location.name.length > PROJECT_LIMITS.LOCATIONS.MAX_LOCATION_NAME_LENGTH) {
        // message.error(`Название локации не может быть длиннее ${PROJECT_LIMITS.LOCATIONS.MAX_LOCATION_NAME_LENGTH} символов`);
        return false;
      }

      if (location.description && location.description.length > PROJECT_LIMITS.LOCATIONS.MAX_LOCATION_DESCRIPTION_LENGTH) {
        // message.error(`Описание локации не может быть длиннее ${PROJECT_LIMITS.LOCATIONS.MAX_LOCATION_DESCRIPTION_LENGTH} символов`);
        return false;
      }

      locations.value.push({
        ...location,
        id: createID<'Location'>()
      });
      return true;
    };

    const updateLocation = (index: number, location: ILocation) => {
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
      removeLocation,
      canAddLocation
    };
  }
);
