<script lang="ts" setup>
import { NCard, NGrid, NGridItem, NButton, NSpace, NTooltip, NProgress } from 'naive-ui';
import { usePrivateCharacterStore } from './character.store';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import NewCharacter from './NewCharacter.vue';
import { computed } from 'vue';

const store = usePrivateCharacterStore();

const getTypeLabel = (type: string): string => {
  return type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const charactersProgress = computed(() => ({
  percentage: (store.characters.length / PROJECT_LIMITS.CHARACTERS.MAX_CHARACTERS_PER_PROJECT) * 100,
  current: store.characters.length,
  max: PROJECT_LIMITS.CHARACTERS.MAX_CHARACTERS_PER_PROJECT
}));
</script>

<template>
  <div class="characters-container">
    <div class="characters-header">
      <h2>Персонажи</h2>
      <div class="characters-limit">
        <span class="limit-text">{{ charactersProgress.current }} / {{ charactersProgress.max }}</span>
        <NProgress
          type="line"
          :percentage="charactersProgress.percentage"
          :height="12"
          :border-radius="6"
          :color="charactersProgress.percentage >= 90 ? '#d03050' : undefined"
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
        <NewCharacter v-if="store.canAddCharacter" />
        <NCard v-else class="limit-card">
          <div class="limit-message">
            Достигнут лимит персонажей ({{ PROJECT_LIMITS.CHARACTERS.MAX_CHARACTERS_PER_PROJECT }})
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
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

.limit-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.limit-message {
  color: #666;
  text-align: center;
  padding: 20px;
}

.characters-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.characters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.characters-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color-base);
}

.characters-limit {
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
</style>
