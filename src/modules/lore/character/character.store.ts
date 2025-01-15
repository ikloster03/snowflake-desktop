import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Character } from './character.types';

export const CHARACTER_STORE = 'character';

export const usePrivateCharacterStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${CHARACTER_STORE}`,
  () => {
    const characters = ref<Character[]>([]);

    // Функции для работы с персонажами
    const addCharacter = (character: Character) => {
      characters.value.push(character);
    };

    const removeCharacter = (characterId: string) => {
      const index = characters.value.findIndex((char) => char.id === characterId);
      if (index !== -1) {
        characters.value.splice(index, 1);
      }
    };

    const updateCharacter = (updatedCharacter: Character) => {
      const index = characters.value.findIndex((char) => char.id === updatedCharacter.id);
      if (index !== -1) {
        characters.value[index] = updatedCharacter;
      }
    };

    const getCharacterById = (characterId: string) => {
      return characters.value.find((char) => char.id === characterId);
    };

    return {
      characters,
      addCharacter,
      removeCharacter,
      updateCharacter,
      getCharacterById,
    };
  }
);


