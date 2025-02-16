import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import type { IItem } from './item.types';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
// import { useMessage } from 'naive-ui';

export const ITEM_STORE = 'item';

export const usePrivateItemStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${ITEM_STORE}`,
  () => {
    const items = ref<IItem[]>([]);
    const projectStore = useProjectStore();
    // const message = useMessage();

    const canAddItem = computed(() =>
      items.value.length < PROJECT_LIMITS.ITEMS.MAX_ITEMS_PER_PROJECT
    );

    // Загрузка предметов
    const loadItems = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const itemsPath = `${projectStore.currentProject.path}/items.json`;
        const exists = await fs.exists(itemsPath);

        if (!exists) {
          await fs.writeTextFile(itemsPath, JSON.stringify([], null, 2));
        }

        const itemsJson = await fs.readTextFile(itemsPath);
        items.value = JSON.parse(itemsJson);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };

    // Сохранение предметов
    const saveItems = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/items.json`,
          JSON.stringify(items.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving items:', error);
      }
    };

    // Методы работы с предметами
    const addItem = (item: IItem) => {
      if (!canAddItem.value) {
        // message.error(`Достигнут лимит предметов (${PROJECT_LIMITS.ITEMS.MAX_ITEMS_PER_PROJECT})`);
        return false;
      }

      if (item.name.length > PROJECT_LIMITS.ITEMS.MAX_ITEM_NAME_LENGTH) {
        // message.error(`Название предмета не может быть длиннее ${PROJECT_LIMITS.ITEMS.MAX_ITEM_NAME_LENGTH} символов`);
        return false;
      }

      if (item.description && item.description.length > PROJECT_LIMITS.ITEMS.MAX_ITEM_DESCRIPTION_LENGTH) {
        // message.error(`Описание предмета не может быть длиннее ${PROJECT_LIMITS.ITEMS.MAX_ITEM_DESCRIPTION_LENGTH} символов`);
        return false;
      }

      items.value.push({
        ...item,
        id: crypto.randomUUID()
      });
      return true;
    };

    const updateItem = (updatedItem: IItem) => {
      const index = items.value.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        items.value[index] = updatedItem;
      }
    };

    const removeItem = (itemId: string) => {
      const index = items.value.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        items.value.splice(index, 1);
      }
    };

    // Следим за изменениями проекта
    watch(() => projectStore.currentProject?.path, loadItems, { immediate: true });

    // Следим за изменениями предметов
    watch(items, saveItems, { deep: true });

    return {
      items,
      addItem,
      updateItem,
      removeItem,
      canAddItem
    };
  }
);
