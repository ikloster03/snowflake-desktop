import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import { Character } from './character.types';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
// import { useMessage } from 'naive-ui';

export const CHARACTER_STORE = 'character';

export const usePrivateCharacterStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${CHARACTER_STORE}`,
  () => {
    const characters = ref<Character[]>([]);
    const projectStore = useProjectStore();
    // const message = useMessage();

    const canAddCharacter = computed(() =>
      characters.value.length < PROJECT_LIMITS.CHARACTERS.MAX_CHARACTERS_PER_PROJECT
    );

    // Загрузка персонажей
    const loadCharacters = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const charactersPath = `${projectStore.currentProject.path}/lore/characters.json`;
        const exists = await fs.exists(charactersPath);

        if (!exists) {
          await fs.writeTextFile(charactersPath, JSON.stringify([], null, 2));
        }

        const charactersJson = await fs.readTextFile(charactersPath);
        characters.value = JSON.parse(charactersJson);
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    // Сохранение персонажей
    const saveCharacters = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/lore/characters.json`,
          JSON.stringify(characters.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving characters:', error);
      }
    };

    // Функции для работы с персонажами
    const addCharacter = (character: Character) => {
      if (!canAddCharacter.value) {
        // message.error(`Достигнут лимит персонажей (${PROJECT_LIMITS.CHARACTERS.MAX_CHARACTERS_PER_PROJECT})`);
        return false;
      }

      if (character.name.length > PROJECT_LIMITS.CHARACTERS.MAX_CHARACTER_NAME_LENGTH) {
        // message.error(`Имя персонажа не может быть длиннее ${PROJECT_LIMITS.CHARACTERS.MAX_CHARACTER_NAME_LENGTH} символов`);
        return false;
      }

      characters.value.push(character);
      return true;
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

    // Следим за изменениями проекта
    watch(() => projectStore.currentProject?.path, loadCharacters, { immediate: true });

    // Следим за изменениями персонажей
    watch(characters, saveCharacters, { deep: true });

    return {
      characters,
      addCharacter,
      removeCharacter,
      updateCharacter,
      getCharacterById,
      canAddCharacter
    };
  }
);


