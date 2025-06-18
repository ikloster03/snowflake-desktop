<script lang="ts" setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { NCard, NList, NListItem, NInput, NEmpty, NIcon } from 'naive-ui';
import { User } from '@vicons/tabler';
import { useI18n } from 'vue-i18n';
import { usePrivateCharacterStore } from '@/modules/lore/character/character.store';
import type { Character } from '@/modules/lore/character/character.types';

interface Props {
  visible: boolean;
  position: { x: number; y: number };
  selectedText: string;
}

interface Emits {
  (e: 'select', character: Character): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const characterStore = usePrivateCharacterStore();
const searchQuery = ref('');
const listRef = ref<HTMLElement>();

const filteredCharacters = computed(() => {
  const characters = characterStore.characters;
  console.log('Все персонажи:', characters);
  console.log('Поисковый запрос:', searchQuery.value);

  if (!searchQuery.value) {
    return characters;
  }
  const filtered = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log('Отфильтрованные персонажи:', filtered);
  return filtered;
});

const popupStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  zIndex: 1001,
  maxWidth: '300px',
  maxHeight: '400px',
}));

const selectCharacter = (character: Character) => {
  console.log('Выбран персонаж:', character);
  emit('select', character);
};

const closePopup = () => {
  console.log('Закрытие попапа');
  emit('close');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closePopup();
  }
};

// Фокус на поле поиска при открытии
watch(() => props.visible, (visible) => {
  if (visible) {
    nextTick(() => {
      const input = document.querySelector('.character-search-input input') as HTMLInputElement;
      input?.focus();

      // Добавляем обработчик для глобальных клавиш
      document.addEventListener('keydown', handleGlobalKeydown);
    });
  } else {
    searchQuery.value = '';

    // Удаляем обработчик
    document.removeEventListener('keydown', handleGlobalKeydown);
  }
});

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePopup();
  }
};

// Очистка при размонтировании
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :style="popupStyle"
      class="character-selection-popup"
      @keydown="handleKeydown"
      @click.stop
    >
      <NCard size="small" class="popup-card" @click.stop>
        <template #header>
          <div class="popup-header">
            <span>{{ t('book.character.add') }}</span>
            <div class="selected-text" v-if="selectedText">
              "{{ selectedText }}"
            </div>
          </div>
        </template>

        <div class="popup-content">
          <NInput
            v-model:value="searchQuery"
            :placeholder="t('book.character.searchPlaceholder')"
            clearable
            class="character-search-input"
            @keydown="handleKeydown"
          />

          <div class="characters-list" v-if="filteredCharacters.length > 0">
            <NList ref="listRef" clickable>
              <NListItem
                v-for="character in filteredCharacters"
                :key="character.id"
                class="character-item"
                @click.stop="selectCharacter(character)"
              >
                <template #prefix>
                  <NIcon size="18">
                    <User />
                  </NIcon>
                </template>
                <div class="character-info" @click.stop="selectCharacter(character)">
                  <div class="character-name">{{ character.name }}</div>
                  <div class="character-description" v-if="character.description">
                    {{ character.description.substring(0, 50) }}{{ character.description.length > 50 ? '...' : '' }}
                  </div>
                </div>
              </NListItem>
            </NList>
          </div>

          <NEmpty v-else :description="t('book.character.notFound')" />
        </div>
      </NCard>
    </div>
  </Teleport>
</template>

<style scoped>
.character-selection-popup {
  pointer-events: all;
}

.popup-card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.popup-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-text {
  font-size: 12px;
  color: var(--text-color-3);
  font-style: italic;
  background-color: var(--code-color);
  padding: 4px 8px;
  border-radius: 4px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.characters-list {
  max-height: 250px;
  overflow-y: auto;
}

.character-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.character-item:hover {
  background-color: var(--hover-color);
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.character-name {
  font-weight: 500;
  color: var(--text-color-1);
}

.character-description {
  font-size: 12px;
  color: var(--text-color-3);
  line-height: 1.4;
}

.character-search-input {
  margin-bottom: 8px;
}
</style>
