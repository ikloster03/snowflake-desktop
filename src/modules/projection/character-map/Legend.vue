<template>
  <div :class="['legend', { 'light-theme': !isDarkTheme }]">
    <h4>Легенда типов отношений</h4>
    <div
      v-for="(color, relation) in relationColors"
      :key="relation"
      class="legend-item"
    >
      <span class="color-box" :style="{ backgroundColor: color }"></span>
      <span>{{ relation }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';

defineProps<{
  relationColors: Record<string, string>;
}>();

// Определяем, активна ли темная тема
const isDarkTheme = ref(document.body.classList.contains('dark-theme'));
</script>

<style scoped>
.legend {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(30, 30, 30, 0.8); /* Темный фон по умолчанию */
  border: 1px solid #444; /* Темная граница по умолчанию */
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  color: #fff; /* Белый текст по умолчанию */
}

.legend.light-theme {
  background-color: rgba(255, 255, 255, 0.8); /* Светлый фон для светлой темы */
  border-color: #ccc; /* Светлая граница */
  color: #000; /* Черный текст для светлой темы */
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 3px;
}
</style>
