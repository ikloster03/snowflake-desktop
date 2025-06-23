<script lang="ts" setup>
import { computed } from 'vue';
import { NButton, NIcon, NTooltip } from 'naive-ui';
import { Package } from '@vicons/tabler';
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
  left: `${props.position.x}px`,
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
      class="floating-item-button"
    >
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton
            type="success"
            size="small"
            circle
            @click="handleClick"
            class="item-button"
          >
            <template #icon>
              <NIcon><Package /></NIcon>
            </template>
          </NButton>
        </template>
        {{ t('book.item.addToText') }}
      </NTooltip>
    </div>
  </Teleport>
</template>

<style scoped>
.floating-item-button {
  pointer-events: all;
}

.item-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid white;
}

.item-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
