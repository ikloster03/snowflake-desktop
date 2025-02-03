<script lang="ts" setup>
import { NCard, NTabs, NTabPane, NSpace, NH1, NButton } from 'naive-ui';
import CharacterList from './character/CharacterList.vue';
import EventList from './event/EventList.vue';
import LocationList from './location/LocationList.vue';
import ItemList from './item/ItemList.vue';
import { useRouter } from 'vue-router';
import { LORE_WORLD_MAP_PAGE, LORE_CHARACTER_PAGE } from './lore.const';

const router = useRouter();

const navigateToCharacter = () => {
  router.push({ name: LORE_CHARACTER_PAGE.name });
};

const navigateToWorldMap = () => {
  router.push({ name: LORE_WORLD_MAP_PAGE.name });
};
</script>

<template>
  <NSpace vertical size="large">
    <NH1 prefix="bar"> Мир произведения </NH1>

    <!-- <NCard title="Мир">
      <NSpace>
        <NButton @click="navigateToCharacter"> Персонажи </NButton>
        <NButton @click="navigateToWorldMap"> Карта мира </NButton>
      </NSpace>
    </NCard> -->

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
