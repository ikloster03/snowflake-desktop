import { usePrivateItemStore } from './item/item.store';

export const useLoreStore = defineStore(LORE_STORE, () => {
  const characterState = usePrivateCharacterStore();
  const locationState = usePrivateLocationStore();
  const eventState = usePrivateEventStore();
  const itemState = usePrivateItemStore();

  const characterList = computed(() => characterState.characters);
  const locationList = computed(() => locationState.locations);
  const eventList = computed(() => eventState.events);
  const itemList = computed(() => itemState.items);

  return {
    characterList,
    locationList,
    eventList,
    itemList,
  };
});
