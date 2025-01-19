<script lang="ts" setup>
import { NCard, NForm, NFormItem, NInput, NDatePicker, NSelect, NButton } from 'naive-ui';
import { ref } from 'vue';
import type { IEvent } from './event.types';

const eventData = ref<IEvent>({
  title: '',
  description: '',
  time: new Date().toString(),
  type: 'other'
});

const eventTypes = [
  { label: 'Битва', value: 'battle' },
  { label: 'Встреча', value: 'meeting' },
  { label: 'Путешествие', value: 'journey' },
  { label: 'Другое', value: 'other' }
];

const emit = defineEmits<{
  (e: 'create', event: IEvent): void;
}>();

const handleSubmit = () => {
  emit('create', eventData.value);
  // Сброс формы после создания
  eventData.value = {
    title: '',
    description: '',
    time: new Date().toString(),
    type: 'other'
  };
};
</script>

<template>
  <NCard>
    <NForm @submit.prevent="handleSubmit">
      <NFormItem label="Название">
        <NInput v-model:value="eventData.title" />
      </NFormItem>

      <NFormItem label="Описание">
        <NInput v-model:value="eventData.description" type="textarea" />
      </NFormItem>

      <NFormItem label="Время">
        <NDatePicker
          v-model:value="eventData.time"
          type="datetime"
          :default-value="new Date()"
        />
      </NFormItem>

      <NFormItem label="Тип события">
        <NSelect v-model:value="eventData.type" :options="eventTypes" />
      </NFormItem>

      <NFormItem>
        <NButton type="primary" attr-type="submit">Создать событие</NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.n-form {
  max-width: 600px;
}
</style>
