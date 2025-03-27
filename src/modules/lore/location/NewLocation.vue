<script lang="ts" setup>
import {
  NCard,
  NInput,
  NSelect,
  NInputNumber,
  NButton,
  NSpace,
} from 'naive-ui';
import { ref } from 'vue';
import { ILocation } from './location.types';
import { createID } from '@/core/id';

const showForm = ref(false);

const locationData = ref<Required<ILocation>>({
  id: createID<'Location'>(),
  name: '',
  description: '',
  type: 'other',
  coordinates: {
    x: 0,
    y: 0,
  },
});

const locationTypes = [
  { label: 'Город', value: 'city' },
  { label: 'Деревня', value: 'village' },
  { label: 'Подземелье', value: 'dungeon' },
  { label: 'Дикая местность', value: 'wilderness' },
  { label: 'Другое', value: 'other' },
];

const emit = defineEmits<{
  (e: 'create', location: ILocation): void;
}>();

const handleQuickCreate = () => {
  if (locationData.value.name) {
    emit('create', locationData.value);
    locationData.value = {
      id: createID<'Location'>(),
      name: '',
      description: '',
      type: 'other',
      coordinates: {
        x: 0,
        y: 0,
      },
    };
    showForm.value = false;
  }
};
</script>

<template>
  <NCard
    hoverable
    class="new-location-card"
    v-if="!showForm"
    @click="showForm = true"
  >
    <div class="add-location-placeholder">
      <div class="plus-icon">+</div>
      <div>Добавить локацию</div>
    </div>
  </NCard>

  <NCard v-else class="new-location-form">
    <NSpace vertical>
      <NInput
        v-model:value="locationData.name"
        placeholder="Название локации"
        @keyup.enter="handleQuickCreate"
      />

      <NInput
        v-model:value="locationData.description"
        type="textarea"
        placeholder="Описание локации"
      />

      <NSelect
        v-model:value="locationData.type"
        :options="locationTypes"
        placeholder="Выберите тип локации"
      />

      <NSpace align="center">
        <NInputNumber
          v-model:value="locationData.coordinates.x"
          placeholder="X"
        />
        <NInputNumber
          v-model:value="locationData.coordinates.y"
          placeholder="Y"
        />
      </NSpace>

      <NSpace justify="end">
        <NButton @click="showForm = false">Отмена</NButton>
        <NButton type="primary" @click="handleQuickCreate">Создать</NButton>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<style scoped>
.new-location-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-location-placeholder {
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

.new-location-form {
  min-width: 300px;
}
</style>
