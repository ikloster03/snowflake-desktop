<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { MapPin } from '@vicons/tabler';
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
  left: `${props.position.x + 60}px`,
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
      class="floating-location-button"
    >
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton
            type="primary"
            size="small"
            circle
            @click="handleClick"
            class="location-button"
          >
            <template #icon>
              <NIcon><MapPin /></NIcon>
            </template>
          </NButton>
        </template>
        {{ t('book.location.addToText') }}
      </NTooltip>
    </div>
  </Teleport>
</template>

<style scoped>
.floating-location-button {
  pointer-events: all;
}

.location-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid white;
}

.location-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
