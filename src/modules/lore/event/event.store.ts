import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import { IEvent } from './event.types';
import { useProjectStore } from '@/modules/project/project.store';

export const EVENT_STORE = 'event';

export const usePrivateEventStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${EVENT_STORE}`,
  () => {
    const events = ref<IEvent[]>([]);
    const projectStore = useProjectStore();

    // Загрузка событий
    const loadEvents = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const eventsPath = `${projectStore.currentProject.path}/events.json`;
        const exists = await fs.exists(eventsPath);

        if (!exists) {
          await fs.writeTextFile(eventsPath, JSON.stringify([], null, 2));
        }

        const eventsJson = await fs.readTextFile(eventsPath);
        events.value = JSON.parse(eventsJson);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    // Сохранение событий
    const saveEvents = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/events.json`,
          JSON.stringify(events.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving events:', error);
      }
    };

    // Методы работы с событиями
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

    // Следим за изменениями проекта
    watch(() => projectStore.currentProject?.path, loadEvents, { immediate: true });

    // Следим за изменениями событий
    watch(events, saveEvents, { deep: true });

    return {
      events,
      addEvent,
      updateEvent,
      removeEvent
    };
  }
);
