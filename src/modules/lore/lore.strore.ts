import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePrivateCharacterStore } from './character/character.store';
import { usePrivateLocationStore } from './location/location.store';

export const LORE_STORE = 'lore';

export const useLoreStore = defineStore(LORE_STORE, () => {
  const characterState = usePrivateCharacterStore();
  const locationState = usePrivateLocationStore();

  const characterList = computed(() => characterState.characters);
  const locationList = computed(() => locationState.locations);

  return {
    characterList,
    locationList,
  };
});
