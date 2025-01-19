<script lang="ts" setup>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton } from 'naive-ui';
import { ref } from 'vue';
import { usePrivateCharacterStore } from './character.store';
import { CHARACTER_LEVEL, MAIN_CHARACTER_TYPE, SECONDARY_CHARACTER_TYPE } from './character.const';
import type { Character } from './character.types';

const store = usePrivateCharacterStore();

const character = ref<Partial<Character>>({
  id: crypto.randomUUID(),
  name: '',
  level: CHARACTER_LEVEL.PRIMARY,
  type: MAIN_CHARACTER_TYPE.PROTAGONIST,
});

const characterLevelOptions = Object.entries(CHARACTER_LEVEL).map(([key, value]) => ({
  label: key,
  value: value,
}));

const typeOptions = ref([]);

// Обновляем опции типа персонажа при изменении уровня
const updateTypeOptions = (level: string) => {
  if (level === CHARACTER_LEVEL.PRIMARY) {
    typeOptions.value = Object.entries(MAIN_CHARACTER_TYPE).map(([key, value]) => ({
      label: key,
      value: value,
    }));
    character.value.type = MAIN_CHARACTER_TYPE.PROTAGONIST;
  } else if (level === CHARACTER_LEVEL.SECONDARY) {
    typeOptions.value = Object.entries(SECONDARY_CHARACTER_TYPE).map(([key, value]) => ({
      label: key,
      value: value,
    }));
    character.value.type = SECONDARY_CHARACTER_TYPE.MENTOR;
  }
};

// Инициализация начальных опций
updateTypeOptions(character.value.level as string);

const handleLevelChange = (value: string) => {
  character.value.level = value;
  updateTypeOptions(value);
};

const handleSubmit = () => {
  if (character.value.name && character.value.level && character.value.type) {
    store.addCharacter(character.value as Character);
    // Сброс формы
    character.value = {
      id: crypto.randomUUID(),
      name: '',
      level: CHARACTER_LEVEL.PRIMARY,
      type: MAIN_CHARACTER_TYPE.PROTAGONIST,
    };
  }
};
</script>

<template>
  <NCard title="Создание персонажа">
    <NForm>
      <NFormItem label="Имя персонажа">
        <NInput v-model:value="character.name" placeholder="Введите имя персонажа" />
      </NFormItem>

      <NFormItem label="Уровень персонажа">
        <NSelect
          v-model:value="character.level"
          :options="characterLevelOptions"
          @update:value="handleLevelChange"
        />
      </NFormItem>

      <NFormItem label="Тип персонажа">
        <NSelect
          v-model:value="character.type"
          :options="typeOptions"
        />
      </NFormItem>

      <NButton type="primary" @click="handleSubmit">
        Сохранить персонажа
      </NButton>
    </NForm>

    <!-- Список существующих персонажей -->
    <div class="characters-list" v-if="store.characters.length">
      <h3>Существующие персонажи:</h3>
      <NCard v-for="char in store.characters" :key="char.id" class="character-card">
        <h4>{{ char.name }}</h4>
        <p>Уровень: {{ char.level }}</p>
        <p>Тип: {{ char.type }}</p>
        <NButton
          type="error"
          size="small"
          @click="store.removeCharacter(char.id)"
        >
          Удалить
        </NButton>
      </NCard>
    </div>
  </NCard>
</template>

<style scoped>
.characters-list {
  margin-top: 20px;
}

.character-card {
  margin: 10px 0;
}

.character-card h4 {
  margin: 0 0 10px 0;
}

.character-card p {
  margin: 5px 0;
}
</style>
