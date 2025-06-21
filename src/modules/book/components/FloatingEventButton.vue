<script lang="ts" setup>
import { computed } from 'vue';
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { Calendar } from '@vicons/tabler';
import { useI18n } from 'vue-i18n';

interface Props {
  visible: boolean;
  position: { x: number; y: number };
}

interface Emits {
  (e: 'click'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const buttonStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${props.position.x + 40}px`, // Смещаем вправо от кнопки персонажа
  top: `${props.position.y}px`,
  zIndex: 1000,
  transform: 'translateY(-100%)',
  marginTop: '-8px',
}));

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :style="buttonStyle"
      class="floating-event-button"
    >
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton
            type="success"
            size="small"
            circle
            @click="handleClick"
            class="event-button"
          >
            <template #icon>
              <NIcon><Calendar /></NIcon>
            </template>
          </NButton>
        </template>
        {{ t('book.event.addToText') }}
      </NTooltip>
    </div>
  </Teleport>
</template>

<style scoped>
.floating-event-button {
  pointer-events: all;
}

.event-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid white;
}

.event-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
