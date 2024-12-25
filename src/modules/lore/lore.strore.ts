import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePrivateCharacterStore } from './character/character.store';

export const LORE_STORE = 'lore';

export const useLoreStore = defineStore(LORE_STORE, () => {
  const state = usePrivateCharacterStore();

  const character = computed(() => state.character);


  return {
    character
  };
});
