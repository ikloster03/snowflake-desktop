import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IItem } from './item.types';

export const ITEM_STORE = 'item';

export const usePrivateItemStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${ITEM_STORE}`,
  () => {
    const items = ref<IItem[]>([]);

    const addItem = (item: IItem) => {
      items.value.push(item);
    };

    const removeItem = (itemId: string) => {
      const index = items.value.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        items.value.splice(index, 1);
      }
    };

    const updateItem = (updatedItem: IItem) => {
      const index = items.value.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        items.value[index] = updatedItem;
      }
    };

    return {
      items,
      addItem,
      removeItem,
      updateItem,
    };
  }
);
