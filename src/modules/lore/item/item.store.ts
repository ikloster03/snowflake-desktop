import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import type { IItem } from './item.types';
import { useProjectStore } from '@/modules/project/project.store';

export const ITEM_STORE = 'item';

export const usePrivateItemStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${ITEM_STORE}`,
  () => {
    const items = ref<IItem[]>([]);
    const projectStore = useProjectStore();

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
      items.value.push({
        ...item,
        id: crypto.randomUUID()
      });
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
      removeItem
    };
  }
);
