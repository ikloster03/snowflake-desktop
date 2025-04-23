import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import * as fs from '@tauri-apps/plugin-fs';
import { Character, Edge } from './character.types';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
// import { useMessage } from 'naive-ui';

export const CHARACTER_STORE = 'character';

export const usePrivateCharacterStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${CHARACTER_STORE}`,
  () => {
    const characters = ref<Character[]>([]);
    const characterEdges = ref<Record<string, Edge>>({});
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

    // Загрузка связей персонажей
    const loadCharacterEdges = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const edgesPath = `${projectStore.currentProject.path}/lore/character_edges.json`;
        const exists = await fs.exists(edgesPath);

        if (!exists) {
          await fs.writeTextFile(edgesPath, JSON.stringify({}, null, 2));
        }

        const edgesJson = await fs.readTextFile(edgesPath);
        characterEdges.value = JSON.parse(edgesJson);
      } catch (error) {
        console.error('Error loading character edges:', error);
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

    // Сохранение связей персонажей
    const saveCharacterEdges = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/lore/character_edges.json`,
          JSON.stringify(characterEdges.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving character edges:', error);
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

        // Удаляем все связи этого персонажа
        const edgesToRemove = Object.keys(characterEdges.value).filter(
          (edgeId) =>
            characterEdges.value[edgeId].source === characterId ||
            characterEdges.value[edgeId].target === characterId
        );

        edgesToRemove.forEach((edgeId) => {
          const { [edgeId]: _, ...rest } = characterEdges.value;
          characterEdges.value = rest;
        });
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

    // Функции для работы со связями персонажей
    const addEdge = (edge: Edge) => {
      characterEdges.value = {
        ...characterEdges.value,
        [edge.id]: edge
      };
    };

    const updateEdge = (updatedEdge: Edge) => {
      characterEdges.value = {
        ...characterEdges.value,
        [updatedEdge.id]: updatedEdge
      };
    };

    const removeEdge = (edgeId: string) => {
      const { [edgeId]: _, ...rest } = characterEdges.value;
      characterEdges.value = rest;
    };

    // Следим за изменениями проекта
    watch(() => projectStore.currentProject?.path, () => {
      loadCharacters();
      loadCharacterEdges();
    }, { immediate: true });

    // Следим за изменениями персонажей и связей
    watch(characters, saveCharacters, { deep: true });
    watch(characterEdges, saveCharacterEdges, { deep: true });

    return {
      characters,
      characterEdges,
      addCharacter,
      removeCharacter,
      updateCharacter,
      getCharacterById,
      addEdge,
      updateEdge,
      removeEdge,
      canAddCharacter
    };
  }
);


