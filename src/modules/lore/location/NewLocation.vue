<script lang="ts" setup>
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NInputNumber,
  NButton,
  NSpace,
} from 'naive-ui';
import { ref } from 'vue';
import { ILocation } from './location.types';

const locationData = ref<Required<ILocation>>({
  id: crypto.randomUUID(),
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

const handleSubmit = () => {
  emit('create', locationData.value);
  locationData.value = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    type: 'other',
    coordinates: {
      x: 0,
      y: 0,
    },
  };
};
</script>

<template>
  <NCard>
    <NForm @submit.prevent="handleSubmit">
      <NFormItem label="Название">
        <NInput v-model:value="locationData.name" />
      </NFormItem>

      <NFormItem label="Описание">
        <NInput v-model:value="locationData.description" type="textarea" />
      </NFormItem>

      <NFormItem label="Тип локации">
        <NSelect v-model:value="locationData.type" :options="locationTypes" />
      </NFormItem>

      <NFormItem label="Координаты">
        <NSpace>
          <NInputNumber
            v-model:value="locationData.coordinates.x"
            placeholder="X"
          />
          <NInputNumber
            v-model:value="locationData.coordinates.y"
            placeholder="Y"
          />
        </NSpace>
      </NFormItem>

      <NFormItem>
        <NButton type="primary" attr-type="submit">Создать локацию</NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.n-form {
  max-width: 600px;
}
</style>
