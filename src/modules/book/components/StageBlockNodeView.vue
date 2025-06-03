<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { useBookStore } from '../book.store'

// Используем правильные типы для NodeView
const props = defineProps<{
  node: any
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
  editor: any
  getPos: () => number
  decorations: any
  selected: boolean
  extension: any
  view: any
  innerDecorations: any
  HTMLAttributes: any
}>()

const bookStore = useBookStore()

const selectedStageId = ref(props.node.attrs.stageId || '')

// Получаем ID текущей главы из currentChapterText
const currentChapterId = computed(() => {
  return bookStore.currentChapterText?.id || null
})

// Получаем список сцен текущей главы
const availableStages = computed(() => {
  if (!currentChapterId.value) {
    return []
  }
  return bookStore.getChapterStages(currentChapterId.value)
})

// Обработчик изменения выбранной сцены
const handleStageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedStageId.value = target.value
  props.updateAttributes({ stageId: target.value })
}

// Получаем информацию о выбранной сцене
const selectedStage = computed(() => {
  if (!selectedStageId.value) return null
  return availableStages.value.find((stage: any) => stage.id === selectedStageId.value)
})

onMounted(() => {
  // Загружаем сцены при монтировании
  if (currentChapterId.value) {
    bookStore.loadStages()
  }
})
</script>

<template>
  <NodeViewWrapper class="stage-block">
    <div class="stage-header" contenteditable="false">
      <span>🎬</span>
      <select
        class="stage-selector"
        :value="selectedStageId"
        @change="handleStageChange"
      >
        <option value="">Выберите сцену...</option>
        <option
          v-for="stage in availableStages"
          :key="stage.id"
          :value="stage.id"
        >
          {{ stage.title || `Сцена ${stage.id}` }}
        </option>
      </select>
      <div v-if="selectedStage" class="stage-info">
        <small>{{ selectedStage.description || 'Без описания' }}</small>
      </div>
    </div>
    <div class="stage-content">
      <NodeViewContent />
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.stage-info {
  margin-left: auto;
  color: #6b7280;
  font-style: italic;
}

.stage-info small {
  font-size: 12px;
}
</style>
