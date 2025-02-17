import { defineStore } from 'pinia';
import { PRIVATE_STORE_PREFIX } from '@/store.const';

export const BOOK_STORE = 'book';

const useBookPrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${BOOK_STORE}`,
  () => {

  }
);

export const useBookStore = defineStore(BOOK_STORE, () => {

  return {

  };
});
