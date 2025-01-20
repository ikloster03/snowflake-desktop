<script lang="ts" setup>
import { NCard, NTabs, NTabPane, NSpace, NH1 } from 'naive-ui';
import CharacterList from './character/CharacterList.vue';
import EventList from './event/EventList.vue';
import LocationList from './location/LocationList.vue';
import ItemList from './item/ItemList.vue';
</script>

<template>
  <NSpace vertical size="large">
    <NH1 prefix="bar"> Мир произведения </NH1>

    <NTabs type="segment" animated>
      <NTabPane name="characters" tab="Персонажи">
        <NSpace vertical>
          <CharacterList />
        </NSpace>
      </NTabPane>

      <NTabPane name="events" tab="События">
        <NSpace vertical>
          <EventList />
        </NSpace>
      </NTabPane>

      <NTabPane name="locations" tab="Локации">
        <NSpace vertical>
          <LocationList />
        </NSpace>
      </NTabPane>

      <NTabPane name="items" tab="Предметы">
        <NSpace vertical>
          <ItemList />
        </NSpace>
      </NTabPane>
    </NTabs>
  </NSpace>
</template>

<style scoped>
:deep(.n-h1) {
  margin: 0;
}

:deep(.n-tabs-nav) {
  margin-bottom: 24px;
}
</style>
