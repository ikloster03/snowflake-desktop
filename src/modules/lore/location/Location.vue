<script lang="ts" setup>
import { NCard, NForm, NFormItem, NInput, NSelect, NInputNumber } from 'naive-ui';
import { ref } from 'vue';
import type { ILocation } from './location.types';

const props = defineProps<{
  location: ILocation;
}>();

const locationData = ref<ILocation>({
  ...props.location
});

const locationTypes = [
  { label: 'Город', value: 'city' },
  { label: 'Деревня', value: 'village' },
  { label: 'Подземелье', value: 'dungeon' },
  { label: 'Дикая местность', value: 'wilderness' },
  { label: 'Другое', value: 'other' }
];

const emit = defineEmits<{
  (e: 'update', location: ILocation): void;
}>();

const handleChange = () => {
  emit('update', locationData.value);
};
</script>

<template>
  <NCard>
    <NForm>
      <NFormItem label="Название">
        <NInput v-model:value="locationData.name" @update:value="handleChange" />
      </NFormItem>

      <NFormItem label="Описание">
        <NInput
          v-model:value="locationData.description"
          type="textarea"
          @update:value="handleChange"
        />
      </NFormItem>

      <NFormItem label="Тип локации">
        <NSelect
          v-model:value="locationData.type"
          :options="locationTypes"
          @update:value="handleChange"
        />
      </NFormItem>

      <NFormItem label="Координаты" v-if="locationData.coordinates">
        <NSpace>
          <NInputNumber
            v-model:value="locationData.coordinates.x"
            placeholder="X"
            @update:value="handleChange"
          />
          <NInputNumber
            v-model:value="locationData.coordinates.y"
            placeholder="Y"
            @update:value="handleChange"
          />
        </NSpace>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.n-form {
  max-width: 600px;
}
</style>
