<script lang="ts" setup>
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  NSelect,
} from 'naive-ui';
import { ref } from 'vue';
import type { Value } from 'naive-ui/es/date-picker/src/interface';
import type { IEvent } from './event.types';

interface EventForm extends Omit<IEvent, 'time'> {
  time: Value;
}

const props = defineProps<{
  event: IEvent;
}>();

const eventData = ref<EventForm>({
  ...props.event,
  time: new Date(props.event.time).getTime(),
});

const eventTypes = [
  { label: 'Битва', value: 'battle' },
  { label: 'Встреча', value: 'meeting' },
  { label: 'Путешествие', value: 'journey' },
  { label: 'Другое', value: 'other' },
];

const emit = defineEmits<{
  (e: 'update', event: IEvent): void;
}>();

const handleChange = () => {
  emit('update', {
    ...eventData.value,
    time: Array.isArray(eventData.value.time)
      ? new Date(eventData.value.time[0]).toString()
      : new Date(eventData.value.time).toString(),
  });
};
</script>

<template>
  <NCard>
    <NForm>
      <NFormItem label="Название">
        <NInput v-model:value="eventData.title" @update:value="handleChange" />
      </NFormItem>

      <NFormItem label="Описание">
        <NInput
          v-model:value="eventData.description"
          type="textarea"
          @update:value="handleChange"
        />
      </NFormItem>

      <NFormItem label="Время">
        <NDatePicker
          v-model:value="eventData.time"
          type="datetime"
          @update:value="handleChange"
        />
      </NFormItem>

      <NFormItem label="Тип события">
        <NSelect
          v-model:value="eventData.type"
          :options="eventTypes"
          @update:value="handleChange"
        />
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.n-form {
  max-width: 600px;
}
</style>
