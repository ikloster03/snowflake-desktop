<script lang="ts" setup>
import { NCard, NGrid, NGridItem, NButton, NSpace, NTooltip } from 'naive-ui';
import { usePrivateCharacterStore } from './character.store';
import NewCharacter from './NewCharacter.vue';

const store = usePrivateCharacterStore();

const getTypeLabel = (type: string): string => {
  return type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
</script>

<template>
  <NGrid
    cols="1 s:2 m:3 l:4 xl:5 2xl:6"
    responsive="screen"
    :x-gap="12"
    :y-gap="12"
  >
    <NGridItem v-for="character in store.characters" :key="character.id">
      <NCard hoverable class="character-card">
        <template #header>
          <div class="character-header">
            <h3 class="character-name">{{ character.name }}</h3>
            <NTooltip trigger="hover">
              <template #trigger>
                <div class="character-level" :class="character.level">
                  {{ character.level === 'primary' ? 'П' : 'В' }}
                </div>
              </template>
              {{ character.level === 'primary' ? 'Главный персонаж' : 'Второстепенный персонаж' }}
            </NTooltip>
          </div>
        </template>

        <div class="character-type">
          {{ getTypeLabel(character.type) }}
        </div>

        <template #footer>
          <NSpace justify="end">
            <NButton
              size="small"
              type="error"
              @click="store.removeCharacter(character.id)"
            >
              Удалить
            </NButton>
          </NSpace>
        </template>
      </NCard>
    </NGridItem>

    <NGridItem>
      <NewCharacter />
    </NGridItem>
  </NGrid>
</template>

<style scoped>
.character-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.character-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.character-name {
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-level {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.character-level.primary {
  background-color: #18a058;
  color: white;
}

.character-level.secondary {
  background-color: #2080f0;
  color: white;
}

.character-type {
  margin: 12px 0;
  color: #666;
  font-size: 0.9rem;
}

.character-actions {
  margin-top: auto;
}
</style>
