<script lang="ts" setup>
import { NGrid, NGridItem, NButton } from 'naive-ui';
import { ref } from 'vue';
import { usePrivateLocationStore } from './location.store';
import Location from './Location.vue';
import NewLocation from './NewLocation.vue';
import type { ILocation } from './location.types';

const locationStore = usePrivateLocationStore();
const showNewLocationForm = ref(false);

const handleLocationUpdate = (updatedLocation: ILocation, index: number) => {
  locationStore.updateLocation(index, updatedLocation);
};

const handleLocationCreate = (newLocation: ILocation) => {
  locationStore.addLocation(newLocation);
  showNewLocationForm.value = false;
};
</script>

<template>
  <NGrid :cols="3" :x-gap="16" :y-gap="16">
    <NGridItem v-for="(location, index) in locationStore.locations" :key="index">
      <Location
        :location="location"
        @update="(updatedLocation) => handleLocationUpdate(updatedLocation, index)"
      />
    </NGridItem>

    <NGridItem>
      <div v-if="!showNewLocationForm" class="add-location-card">
        <NButton type="primary" @click="showNewLocationForm = true">
          Добавить локацию
        </NButton>
      </div>
      <NewLocation v-else @create="handleLocationCreate" />
    </NGridItem>
  </NGrid>
</template>

<style scoped>
.add-location-card {
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
}
</style>
