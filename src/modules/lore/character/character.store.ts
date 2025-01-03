import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Character } from './character.types';

export const CHARACTER_STORE = 'character';

export const usePrivateCharacterStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${CHARACTER_STORE}`,
  () => {
    const characters = ref<Character[]>();

    return {
      characters,
    };
  }
);
