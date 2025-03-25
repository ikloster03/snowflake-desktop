<script lang="ts" setup>
import { NCard, NGrid, NGridItem, NProgress } from 'naive-ui';
import { usePrivateLocationStore } from './location.store';
import Location from './Location.vue';
import NewLocation from './NewLocation.vue';
import type { ILocation } from './location.types';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { computed } from 'vue';

const locationStore = usePrivateLocationStore();

const locationsProgress = computed(() => ({
  percentage:
    (locationStore.locations.length /
      PROJECT_LIMITS.LOCATIONS.MAX_LOCATIONS_PER_PROJECT) *
    100,
  current: locationStore.locations.length,
  max: PROJECT_LIMITS.LOCATIONS.MAX_LOCATIONS_PER_PROJECT,
}));

const handleLocationUpdate = (updatedLocation: ILocation, index: number) => {
  locationStore.updateLocation(index, updatedLocation);
};

const handleLocationCreate = (newLocation: ILocation) => {
  locationStore.addLocation(newLocation);
};

const handleDelete = (locationId: string) => {
  locationStore.removeLocation(locationId);
};
</script>

<template>
  <div class="locations-container">
    <div class="locations-header">
      <h2>Локации</h2>
      <div class="locations-limit">
        <span class="limit-text"
          >{{ locationsProgress.current }} / {{ locationsProgress.max }}</span
        >
        <NProgress
          type="line"
          :percentage="locationsProgress.percentage"
          :height="12"
          :border-radius="6"
          :color="locationsProgress.percentage >= 90 ? '#d03050' : undefined"
          class="limit-progress"
        />
      </div>
    </div>

    <NGrid
      cols="1 s:2 m:3 l:4 xl:5 2xl:6"
      responsive="screen"
      :x-gap="12"
      :y-gap="12"
    >
      <NGridItem
        v-for="(location, index) in locationStore.locations"
        :key="location.id"
      >
        <Location
          :location="location"
          @update="
            (updatedLocation) => handleLocationUpdate(updatedLocation, index)
          "
          @delete="handleDelete"
        />
      </NGridItem>

      <NGridItem>
        <NewLocation
          v-if="locationStore.canAddLocation"
          @create="handleLocationCreate"
        />
        <NCard v-else class="limit-card">
          <div class="limit-message">
            Достигнут лимит локаций ({{
              PROJECT_LIMITS.LOCATIONS.MAX_LOCATIONS_PER_PROJECT
            }})
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
.locations-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.locations-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.locations-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color-base);
}

.locations-limit {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.limit-text {
  font-size: 0.9rem;
  color: var(--text-color-3);
  white-space: nowrap;
}

.limit-progress {
  flex: 1;
  min-width: 100px;
}

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
