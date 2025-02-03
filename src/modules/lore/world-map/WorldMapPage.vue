<script lang="ts" setup>
import { NCard, NSpace, NButton, NInput } from 'naive-ui';
import WorldMapEditor from './WorldMapEditor.vue';
import { ref } from 'vue';

const locations = ref([
  { id: '1', name: 'Город А', x: 100, y: 100 },
  { id: '2', name: 'Деревня Б', x: 200, y: 150 },
]);

const selectedLocation = ref<Location | null>(null);

const handleLocationSelect = (location: Location) => {
  selectedLocation.value = location;
};

const handleAddLocation = () => {
  // Логика добавления новой локации
};

const handleSaveLocation = () => {
  // Логика сохранения изменений локации
};
</script>

<template>
  <NSpace vertical>
    <NCard title="Карта мира">
      <div class="map-container">
        <WorldMapEditor
          :locations="locations"
          @select-location="handleLocationSelect"
        />
      </div>
    </NCard>

    <NCard title="Панель инструментов">
      <NSpace>
        <NButton @click="handleAddLocation"> Добавить локацию </NButton>
      </NSpace>
    </NCard>

    <NCard v-if="selectedLocation" title="Редактирование локации">
      <NSpace vertical>
        <NInput
          v-model:value="selectedLocation.name"
          placeholder="Название локации"
        />
        <NButton @click="handleSaveLocation"> Сохранить </NButton>
      </NSpace>
    </NCard>
  </NSpace>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
  position: relative;
}
</style>
