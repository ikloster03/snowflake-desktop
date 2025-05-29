<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import type { SlashCommandItem } from './SlashCommands';

interface Props {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  maxHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: 300,
});

const selectedIndex = ref(0);
const listRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const filteredItems = computed(() => props.items);

const selectItem = (index: number) => {
  const item = filteredItems.value[index];
  if (item) {
    props.command(item);
  }
};

const scrollToSelected = () => {
  nextTick(() => {
    if (listRef.value) {
      const selectedElement = listRef.value.querySelector(`[data-index="${selectedIndex.value}"]`) as HTMLElement;

      if (selectedElement) {
        console.log('Scrolling to element:', selectedIndex.value, selectedElement);
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      } else {
        console.log('Selected element not found for index:', selectedIndex.value);
      }
    }
  });
};

const upHandler = () => {
  const newIndex = ((selectedIndex.value + filteredItems.value.length - 1) % filteredItems.value.length);
  console.log('Up: from', selectedIndex.value, 'to', newIndex);
  selectedIndex.value = newIndex;
  scrollToSelected();
};

const downHandler = () => {
  const newIndex = ((selectedIndex.value + 1) % filteredItems.value.length);
  console.log('Down: from', selectedIndex.value, 'to', newIndex);
  selectedIndex.value = newIndex;
  scrollToSelected();
};

const enterHandler = () => {
  selectItem(selectedIndex.value);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    upHandler();
    return true;
  }

  if (event.key === 'ArrowDown') {
    downHandler();
    return true;
  }

  if (event.key === 'Enter') {
    enterHandler();
    return true;
  }

  return false;
};

defineExpose({
  onKeyDown,
});

onMounted(() => {
  selectedIndex.value = 0;
});

// Сбрасываем выбранный индекс при изменении списка команд
watch(() => props.items, () => {
  selectedIndex.value = 0;
}, { immediate: true });
</script>

<template>
  <div
    v-if="filteredItems.length > 0"
    ref="containerRef"
    class="slash-commands-list"
    :style="{ maxHeight: props.maxHeight + 'px' }"
  >
    <div ref="listRef" class="commands-container">
      <div
        v-for="(item, index) in filteredItems"
        :key="index"
        :data-index="index"
        class="slash-command-item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="selectItem(index)"
        @mouseenter="selectedIndex = index"
      >
        <div class="command-content">
          <div class="command-icon">{{ item.icon }}</div>
          <div class="command-text">
            <div class="command-title">{{ item.title }}</div>
            <div class="command-description">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slash-commands-list {
  position: absolute;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  min-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
}

.commands-container {
  padding: 4px;
}

.slash-command-item {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin: 2px 0;
}

.slash-command-item:hover {
  background-color: rgba(24, 160, 88, 0.08);
}

.slash-command-item.is-selected {
  background-color: rgba(24, 160, 88, 0.12);
  border: 1px solid rgba(24, 160, 88, 0.3);
}

.command-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.command-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #18a058;
  background-color: rgba(24, 160, 88, 0.1);
  border-radius: 4px;
}

.is-selected .command-icon {
  background-color: rgba(24, 160, 88, 0.2);
  color: #0f7c43;
}

.command-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.command-title {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.is-selected .command-title {
  color: #0f7c43;
  font-weight: 600;
}

.command-description {
  font-size: 12px;
  color: #666;
}

.is-selected .command-description {
  color: rgba(15, 124, 67, 0.8);
}
</style>
