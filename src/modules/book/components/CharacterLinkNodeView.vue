<script lang="ts" setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { NodeViewWrapper } from '@tiptap/vue-3';
import { NButton, NIcon } from 'naive-ui';
import { X } from '@vicons/tabler';
import { usePrivateCharacterStore } from '@/modules/lore/character/character.store';

const props = defineProps<{
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
  extension: any;
  getPos: () => number;
  decorations: any[];
  selected: boolean;
  editor: any;
}>();

const characterStore = usePrivateCharacterStore();
const showDeleteButton = ref(false);

const character = computed(() => {
  return characterStore.getCharacterById(props.node.attrs.characterId);
});

const displayText = computed(() => {
  return props.node.attrs.text || character.value?.name || 'Неизвестный персонаж';
});

const linkClass = computed(() => {
  const baseClass = 'character-link';
  if (!character.value) {
    return `${baseClass} missing`;
  }
  if (showDeleteButton.value) {
    return `${baseClass} active`;
  }
  return baseClass;
});

const handleClick = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  showDeleteButton.value = !showDeleteButton.value;
};

const handleDeleteLink = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();

  const pos = props.getPos();
  const linkText = displayText.value;

  // Заменяем ссылку обычным текстом
  props.editor.chain()
    .focus()
    .setTextSelection({ from: pos, to: pos + 1 })
    .deleteSelection()
    .insertContent(linkText)
    .run();
};

// Скрываем кнопку при клике вне ссылки
const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const linkElement = document.querySelector(`[data-character-link-id="${props.node.attrs.characterId}"]`);

  if (linkElement && !linkElement.contains(target)) {
    showDeleteButton.value = false;
  }
};

// Следим за изменением showDeleteButton
watch(showDeleteButton, () => {
  if (showDeleteButton.value) {
    document.addEventListener('click', handleDocumentClick);
  } else {
    document.removeEventListener('click', handleDocumentClick);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<template>
  <NodeViewWrapper
    as="span"
    :class="linkClass"
    :title="character?.name || 'Персонаж не найден'"
    :data-character-link-id="node.attrs.characterId"
    @click="handleClick"
  >
    <span class="character-link-text">{{ displayText }}</span>
    <NButton
      v-if="showDeleteButton"
      size="tiny"
      type="error"
      class="delete-button"
      @click="handleDeleteLink"
      @mousedown.stop
    >
      <template #icon>
        <NIcon size="12">
          <X />
        </NIcon>
      </template>
    </NButton>
  </NodeViewWrapper>
</template>

<style scoped>
.character-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.character-link:hover {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.character-link.active {
  background-color: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.7);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.character-link.missing {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.character-link.missing:hover {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.character-link-text {
  flex: 1;
}

.delete-button {
  margin-left: 4px;
  padding: 0;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.delete-button:hover {
  opacity: 1;
}
</style>
