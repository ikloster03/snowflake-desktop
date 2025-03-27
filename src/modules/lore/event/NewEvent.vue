<script lang="ts" setup>
import { NCard, NInput, NDatePicker, NSelect, NButton, NSpace } from 'naive-ui';
import { ref } from 'vue';
import type { IEvent } from './event.types';
import { createID } from '@/core/id';

const showForm = ref(false);

const eventData = ref<Omit<IEvent, 'id' | 'time'> & { time: number }>({
  title: '',
  description: '',
  time: Date.now(),
  type: 'other',
});

const eventTypes = [
  { label: 'Битва', value: 'battle' },
  { label: 'Встреча', value: 'meeting' },
  { label: 'Путешествие', value: 'journey' },
  { label: 'Другое', value: 'other' },
];

const emit = defineEmits<{
  (e: 'create', event: IEvent): void;
}>();

const handleQuickCreate = () => {
  if (eventData.value.title) {
    emit('create', {
      ...eventData.value,
      id: createID<'Event'>(),
      time: new Date(eventData.value.time).toString(),
    });

    eventData.value = {
      title: '',
      description: '',
      time: Date.now(),
      type: 'other',
    };
    showForm.value = false;
  }
};
</script>

<template>
  <NCard
    hoverable
    class="new-event-card"
    v-if="!showForm"
    @click="showForm = true"
  >
    <div class="add-event-placeholder">
      <div class="plus-icon">+</div>
      <div>Добавить событие</div>
    </div>
  </NCard>

  <NCard v-else class="new-event-form">
    <NSpace vertical>
      <NInput
        v-model:value="eventData.title"
        placeholder="Название события"
        @keyup.enter="handleQuickCreate"
      />

      <NInput
        v-model:value="eventData.description"
        type="textarea"
        placeholder="Описание события"
      />

      <NDatePicker
        v-model:value="eventData.time"
        type="datetime"
        placeholder="Выберите дату и время"
        :default-value="new Date(eventData.time).getTime()"
      />

      <NSelect
        v-model:value="eventData.type"
        :options="eventTypes"
        placeholder="Выберите тип события"
      />

      <NSpace justify="end">
        <NButton @click="showForm = false">Отмена</NButton>
        <NButton type="primary" @click="handleQuickCreate">Создать</NButton>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<style scoped>
.new-event-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-event-placeholder {
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

.new-event-form {
  min-width: 300px;
}
</style>
