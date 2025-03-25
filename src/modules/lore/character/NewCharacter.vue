<script lang="ts" setup>
import { NCard, NInput, NSelect, NSpace, NButton } from 'naive-ui';
import { ref } from 'vue';
import { usePrivateCharacterStore } from './character.store';
import {
  CHARACTER_LEVEL,
  MAIN_CHARACTER_TYPE,
  SECONDARY_CHARACTER_TYPE,
} from './character.const';
import type {
  Character,
  CharacterLevel,
  CharacterTypeOption,
} from './character.types';
import { createID } from '@/core/id';

const store = usePrivateCharacterStore();
const showForm = ref(false);

const character = ref<Character>({
  id: createID<'Character'>(),
  name: '',
  level: CHARACTER_LEVEL.PRIMARY,
  type: MAIN_CHARACTER_TYPE.PROTAGONIST,
});

const typeOptions = ref<CharacterTypeOption[]>(
  Object.entries(MAIN_CHARACTER_TYPE).map(([key, value]) => ({
    label: key,
    value: value,
  }))
);

const handleLevelChange = (value: CharacterLevel) => {
  character.value.level = value;
  if (value === CHARACTER_LEVEL.PRIMARY) {
    typeOptions.value = Object.entries(MAIN_CHARACTER_TYPE).map(
      ([key, value]) => ({
        label: key,
        value: value,
      })
    );
    character.value.type = MAIN_CHARACTER_TYPE.PROTAGONIST;
  } else {
    typeOptions.value = Object.entries(SECONDARY_CHARACTER_TYPE).map(
      ([key, value]) => ({
        label: key,
        value: value,
      })
    );
    character.value.type = SECONDARY_CHARACTER_TYPE.MENTOR;
  }
};

const handleQuickCreate = () => {
  if (character.value.name) {
    store.addCharacter(character.value);
    character.value = {
      id: createID<'Character'>(),
      name: '',
      level: CHARACTER_LEVEL.PRIMARY,
      type: MAIN_CHARACTER_TYPE.PROTAGONIST,
    };
    showForm.value = false;
  }
};
</script>

<template>
  <NCard
    hoverable
    class="new-character-card"
    v-if="!showForm"
    @click="showForm = true"
  >
    <div class="add-character-placeholder">
      <div class="plus-icon">+</div>
      <div>Добавить персонажа</div>
    </div>
  </NCard>

  <NCard v-else class="new-character-form">
    <NSpace vertical>
      <NInput
        v-model:value="character.name"
        placeholder="Имя персонажа"
        @keyup.enter="handleQuickCreate"
      />
      <NSelect
        v-model:value="character.level"
        :options="[
          { label: 'Главный', value: CHARACTER_LEVEL.PRIMARY },
          { label: 'Второстепенный', value: CHARACTER_LEVEL.SECONDARY },
        ]"
        @update:value="handleLevelChange"
      />
      <NSelect v-model:value="character.type" :options="typeOptions" />
      <NSpace justify="end">
        <NButton @click="showForm = false">Отмена</NButton>
        <NButton type="primary" @click="handleQuickCreate">Создать</NButton>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<style scoped>
.new-character-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-character-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-character-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
}

.plus-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.new-character-form {
  min-width: 300px;
}
</style>
