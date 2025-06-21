import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import { IEvent } from './event.types';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { createID } from '@/core/id';
// import { useMessage } from 'naive-ui';

export const EVENT_STORE = 'event';

export const usePrivateEventStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${EVENT_STORE}`,
  () => {
    const events = ref<IEvent[]>([]);
    const projectStore = useProjectStore();
    // const message = useMessage();

    const canAddEvent = computed(() =>
      events.value.length < PROJECT_LIMITS.TIMELINE.MAX_EVENTS_PER_PROJECT
    );

    // Загрузка событий
    const loadEvents = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const eventsPath = `${projectStore.currentProject.path}/lore/events.json`;
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
          `${projectStore.currentProject.path}/lore/events.json`,
          JSON.stringify(events.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving events:', error);
      }
    };

    // Методы работы с событиями
    const addEvent = (event: IEvent) => {
      if (!canAddEvent.value) {
        // message.error(`Достигнут лимит событий (${PROJECT_LIMITS.TIMELINE.MAX_EVENTS_PER_PROJECT})`);
        return false;
      }

      if (event.title.length > PROJECT_LIMITS.TIMELINE.MAX_EVENT_NAME_LENGTH) {
        // message.error(`Название события не может быть длиннее ${PROJECT_LIMITS.TIMELINE.MAX_EVENT_NAME_LENGTH} символов`);
        return false;
      }

      if (event.description && event.description.length > PROJECT_LIMITS.TIMELINE.MAX_EVENT_DESCRIPTION_LENGTH) {
        // message.error(`Описание события не может быть длиннее ${PROJECT_LIMITS.TIMELINE.MAX_EVENT_DESCRIPTION_LENGTH} символов`);
        return false;
      }

      events.value.push({
        ...event,
        id: createID<'Event'>()
      });
      return true;
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

    const getEventById = (id: string) => {
      return events.value.find((e) => e.id === id);
    };

    // Следим за изменениями проекта
    watch(() => projectStore.currentProject?.path, loadEvents, { immediate: true });

    // Следим за изменениями событий
    watch(events, saveEvents, { deep: true });

    return {
      events,
      addEvent,
      updateEvent,
      removeEvent,
      getEventById,
      canAddEvent,
      loadEvents,
      saveEvents,
    };
  }
);

// Публичный стор для использования в компонентах
export const useEventStore = defineStore(EVENT_STORE, () => {
  const privateStore = usePrivateEventStore();

  return {
    events: privateStore.events,
    loadEvents: privateStore.loadEvents,
    getEventById: privateStore.getEventById,
  };
});
