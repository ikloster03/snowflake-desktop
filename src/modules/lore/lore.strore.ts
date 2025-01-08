import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePrivateCharacterStore } from './character/character.store';
import { usePrivateLocationStore } from './location/location.store';
import { usePrivateEventStore } from './event/event.store';

export const LORE_STORE = 'lore';

export const useLoreStore = defineStore(LORE_STORE, () => {
  const characterState = usePrivateCharacterStore();
  const locationState = usePrivateLocationStore();
  const eventState = usePrivateEventStore();

  const characterList = computed(() => characterState.characters);
  const locationList = computed(() => locationState.locations);
  const eventList = computed(() => eventState.events);

  return {
    characterList,
    locationList,
    eventList,
  };
});
