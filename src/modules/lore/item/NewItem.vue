<script lang="ts" setup>
import {
  NCard,
  NSpace,
  NInput,
  NSelect,
  NDynamicTags,
  NButton,
} from 'naive-ui';
import { ref } from 'vue';
import { usePrivateItemStore } from './item.store';
import type { IItem } from './item.types';

const store = usePrivateItemStore();
const showForm = ref(false);

const itemData = ref<IItem>({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  type: 'other',
  rarity: 'common',
  properties: [],
});

const itemTypes = [
  { label: 'Оружие', value: 'weapon' },
  { label: 'Броня', value: 'armor' },
  { label: 'Артефакт', value: 'artifact' },
  { label: 'Расходник', value: 'consumable' },
  { label: 'Квестовый', value: 'quest' },
  { label: 'Другое', value: 'other' },
];

const rarityOptions = [
  { label: 'Обычный', value: 'common' },
  { label: 'Необычный', value: 'uncommon' },
  { label: 'Редкий', value: 'rare' },
  { label: 'Легендарный', value: 'legendary' },
];

const handleCreate = () => {
  if (itemData.value.name) {
    store.addItem(itemData.value);
    itemData.value = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      type: 'other',
      rarity: 'common',
      properties: [],
    };
    showForm.value = false;
  }
};
</script>

<template>
  <NCard
    hoverable
    class="new-item-card"
    v-if="!showForm"
    @click="showForm = true"
  >
    <div class="add-item-placeholder">
      <div class="plus-icon">+</div>
      <div>Добавить предмет</div>
    </div>
  </NCard>

  <NCard v-else class="new-item-form">
    <NSpace vertical>
      <NInput v-model:value="itemData.name" placeholder="Название предмета" />
      <NInput
        v-model:value="itemData.description"
        type="textarea"
        placeholder="Описание"
      />
      <NSelect
        v-model:value="itemData.type"
        :options="itemTypes"
        placeholder="Тип предмета"
      />
      <NSelect
        v-model:value="itemData.rarity"
        :options="rarityOptions"
        placeholder="Редкость"
      />
      <NDynamicTags v-model:value="itemData.properties" />
      <NSpace justify="end">
        <NButton @click="showForm = false">Отмена</NButton>
        <NButton type="primary" @click="handleCreate">Создать</NButton>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<style scoped>
.new-item-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.new-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-item-placeholder {
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

.new-item-form {
  min-width: 300px;
}
</style>
