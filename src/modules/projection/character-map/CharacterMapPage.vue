<script lang="ts" setup>
import { NCard, NButton, NIcon } from 'naive-ui'
import { VNetworkGraph } from 'v-network-graph'
import { Add12Regular as Add } from '@vicons/fluent'
import { ref } from 'vue'
import 'v-network-graph/lib/style.css'

// Типы
interface Character {
  id: string
  name: string
  description: string
}

interface Edge {
  source: string
  target: string
  relation: string
}

// Константы
const INITIAL_CHARACTERS: Character[] = [
  { id: 'char1', name: 'Анна Каренина', description: 'Главная героиня' },
  { id: 'char2', name: 'Алексей Вронский', description: 'Возлюбленный Анны' },
  { id: 'char3', name: 'Алексей Каренин', description: 'Муж Анны' },
  { id: 'char4', name: 'Стива Облонский', description: 'Брат Анны' },
  { id: 'char5', name: 'Долли Облонская', description: 'Жена Стивы' },
  { id: 'char6', name: 'Константин Левин', description: 'Друг Стивы' },
  { id: 'char7', name: 'Кити Щербацкая', description: 'Жена Левина' },
]

const INITIAL_EDGES: Record<string, Edge> = {
  edge1: { source: 'char1', target: 'char2', relation: 'любовь' },
  edge2: { source: 'char1', target: 'char3', relation: 'брак' },
  edge3: { source: 'char1', target: 'char4', relation: 'родственники' },
  edge4: { source: 'char4', target: 'char5', relation: 'брак' },
  edge5: { source: 'char4', target: 'char6', relation: 'дружба' },
  edge6: { source: 'char6', target: 'char7', relation: 'брак' },
}

// Состояние
const isCreatingEdge = ref(false)
const selectedNodes = ref<string[]>([])
const edges = ref<Record<string, Edge>>(INITIAL_EDGES)

// Преобразование данных
const nodes = INITIAL_CHARACTERS.reduce((acc, char) => {
  acc[char.id] = {
    name: char.name,
    description: char.description
  }
  return acc
}, {} as Record<string, { name: string; description: string }>)

// Конфигурация графа
const graphConfig = {
  layouts: {
    force: {
      gravity: -1000,
      springLength: 200,
    }
  },
  configs: {
    node: {
      label: {
        visible: true,
        fontSize: 14,
      }
    },
    edge: {
      normal: {
        width: 2,
      }
    }
  }
}

const eventHandlers: EventHandlers = {
  "node:click": (nodeId: string) => {
    console.log('node:click', nodeId, isCreatingEdge.value);

    if (!isCreatingEdge.value) return

  selectedNodes.value.push(nodeId)

  console.log('handleNodeClick', selectedNodes.value);
  if (selectedNodes.value.length === 2) {
    createNewEdge()
  }
  },
}

// Методы

const createNewEdge = () => {
  const newEdgeId = `edge${Object.keys(edges.value).length + 1}`
  edges.value = {
    ...edges.value,
    [newEdgeId]: {
      source: selectedNodes.value[0].node,
      target: selectedNodes.value[1].node,
      relation: 'новая связь'
    }
  }

  console.log('edges', edges.value);

  resetEdgeCreation()
}

const startCreatingEdge = () => {
  console.log('starting');

  isCreatingEdge.value = true
  selectedNodes.value = []
}

const resetEdgeCreation = () => {
  console.log('reset');
  isCreatingEdge.value = false
  selectedNodes.value = []
}
</script>

<template>
  <NCard>
    <v-network-graph
      :nodes="nodes"
      :edges="edges"
      :layouts="graphConfig.layouts"
      :configs="graphConfig.configs"
      :event-handlers="eventHandlers"
    />

    <NButton
      class="float-button"
      type="primary"
      circle
      @click="startCreatingEdge"
    >
      <template #icon>
        <NIcon>
          <Add />
        </NIcon>
      </template>
    </NButton>
  </NCard>
</template>

<style scoped>
.v-network-graph {
  height: 600px;
}

.float-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 48px;
  height: 48px;
}
</style>
