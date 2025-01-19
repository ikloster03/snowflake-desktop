<script lang="ts" setup>
import { NCard, NCollapse, NCollapseItem, NList, NListItem } from 'naive-ui';

const chapters = [
  {
    id: 1,
    title: 'Глава 1: Начало пути',
    scenes: [
      { id: 1, title: 'Сцена 1: Пробуждение героя' },
      { id: 2, title: 'Сцена 2: Встреча с наставником' },
      { id: 3, title: 'Сцена 3: Первое испытание' },
    ]
  },
  {
    id: 2,
    title: 'Глава 2: Путешествие начинается',
    scenes: [
      { id: 1, title: 'Сцена 1: Выход из дома' },
      { id: 2, title: 'Сцена 2: Первые трудности' },
      { id: 3, title: 'Сцена 3: Неожиданная помощь' },
    ]
  },
  {
    id: 3,
    title: 'Глава 3: Первые препятствия',
    scenes: [
      { id: 1, title: 'Сцена 1: Встреча с антагонистом' },
      { id: 2, title: 'Сцена 2: Потеря важного артефакта' },
      { id: 3, title: 'Сцена 3: Поиски решения' },
    ]
  }
];
</script>

<template>
  <NCard>
    <NCollapse>
      <NCollapseItem
        v-for="chapter in chapters"
        :key="chapter.id"
        :title="chapter.title"
      >
        <NList>
          <NListItem
            v-for="scene in chapter.scenes"
            :key="scene.id"
          >
            {{ scene.title }}
          </NListItem>
        </NList>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped>
.n-collapse-item {
  margin-bottom: 8px;
}

.n-list-item {
  padding: 8px 16px;
  cursor: pointer;
}

.n-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
