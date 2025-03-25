<script lang="ts" setup>
import { createID } from '@/core/id';
import {
  Character,
  Edge,
  RELATION_TYPES,
} from '@/modules/lore/character/character.types';
import { Add12Regular as Add } from '@vicons/fluent';
import {
  NButton,
  NCard,
  NIcon,
  NPopover,
  NSelect,
  NSpace,
  useThemeVars,
} from 'naive-ui';
import type {
  EdgeEvent,
  EventHandlers,
  NodeEvent,
  Edge as VNetworkEdge,
  Node as VNetworkNode,
} from 'v-network-graph';
import * as vNG from 'v-network-graph';
import { VEdgeLabel, VNetworkGraph } from 'v-network-graph';
import 'v-network-graph/lib/style.css';
import { computed, reactive, ref } from 'vue';
import Legend from './Legend.vue';

// Константы
const INITIAL_CHARACTERS: Character[] = [
  {
    id: createID<'Character'>('char1'),
    name: 'Анна Каренина',
    description: 'Главная героиня',
    level: 'primary',
    type: 'protagonist',
  },
  {
    id: createID<'Character'>('char2'),
    name: 'Алексей Вронский',
    description: 'Возлюбленный Анны',
    level: 'secondary',
    type: 'love interest',
  },
  {
    id: createID<'Character'>('char3'),
    name: 'Алексей Каренин',
    description: 'Муж Анны',
    level: 'secondary',
    type: 'foil',
  },
  {
    id: createID<'Character'>('char4'),
    name: 'Стива Облонская',
    description: 'Брат Анны',
    level: 'secondary',
    type: 'plot mover',
  },
  {
    id: createID<'Character'>('char5'),
    name: 'Долли Облонская',
    description: 'Жена Стивы',
    level: 'tertiary',
    type: 'confidante',
  },
  {
    id: createID<'Character'>('char6'),
    name: 'Константин Левин',
    description: 'Друг Стивы',
    level: 'secondary',
    type: 'plot mover',
  },
  {
    id: createID<'Character'>('char7'),
    name: 'Кити Щербацкая',
    description: 'Жена Левина',
    level: 'tertiary',
    type: 'confidante',
  },
];

const INITIAL_EDGES: Record<string, Edge> = {
  edge1: { id: 'edge1', source: 'char1', target: 'char2', relation: 'любовь' },
  edge2: { id: 'edge2', source: 'char1', target: 'char3', relation: 'брак' },
  edge3: {
    id: 'edge3',
    source: 'char1',
    target: 'char4',
    relation: 'родственники',
  },
  edge4: { id: 'edge4', source: 'char4', target: 'char5', relation: 'брак' },
  edge5: { id: 'edge5', source: 'char4', target: 'char6', relation: 'дружба' },
  edge6: { id: 'edge6', source: 'char6', target: 'char7', relation: 'брак' },
};

// Состояние
const isCreatingEdge = ref(false);
const selectedNodes = ref<string[]>([]);
const edges = ref<Record<string, Edge>>(INITIAL_EDGES);
const selectedEdge = ref<Edge | null>(null);
const showEdgeEditor = ref(false);
const popoverX = ref(0);
const popoverY = ref(0);

// Преобразование данных
const nodes = INITIAL_CHARACTERS.reduce(
  (acc, char) => {
    acc[char.id] = {
      name: char.name,
      description: char.description ?? '',
    };
    return acc;
  },
  {} as Record<string, { name: string; description: string }>
);

console.log('nodes', nodes);

// Добавляем цвета для типов отношений
const RELATION_COLORS = {
  любовь: '#FF69B4', // розовый
  брак: '#FFD700', // золотой
  родственники: '#32CD32', // зеленый
  дружба: '#4169E1', // синий
  враги: '#DC143C', // красный
  наставник: '#9370DB', // пурпурный
  ученик: '#87CEEB', // голубой
  коллеги: '#FFA500', // оранжевый
  'новая связь': '#808080', // серый
} as const;

// Передаем цвета для легенды
const relationColors = {
  любовь: '#FF69B4',
  брак: '#FFD700',
  родственники: '#32CD32',
  дружба: '#4169E1',
  враги: '#DC143C',
  наставник: '#9370DB',
  ученик: '#87CEEB',
  коллеги: '#FFA500',
  'новая связь': '#808080',
};

// Добавляем определение темы
const themeVars = useThemeVars();
const isDarkTheme = computed(() =>
  document.body.classList.contains('dark-theme')
);

// Функция для определения кривизны ребра в зависимости от существующих рёбер
// const getEdgeCurvature = (edge: Edge) => {
//   // Проверяем, есть ли встречное ребро
//   const reverseEdge = Object.values(edges.value).find(
//     (e) => e.source === edge.target && e.target === edge.source
//   );

//   // Проверяем, есть ли параллельные рёбра
//   const parallelEdges = Object.values(edges.value).filter(
//     (e) =>
//       (e.source === edge.source && e.target === edge.target) ||
//       (e.source === edge.target && e.target === edge.source)
//   );

//   if (reverseEdge) {
//     // Если есть встречное ребро, изгибаем в противоположные стороны
//     return edge.source < edge.target ? 0.2 : -0.2;
//   } else if (parallelEdges.length > 1) {
//     // Если есть параллельные рёбра, распределяем их по разным кривым
//     const index = parallelEdges.findIndex((e) => e.id === edge.id);
//     return -0.2 + index * 0.2;
//   }

//   return 0; // Прямая линия для одиночных рёбер
// };

// Функция для создания начальных позиций узлов
const calculateInitialPositions = () => {
  const positions: Record<string, { x: number; y: number }> = {};
  const centerX = 0;
  const centerY = 0;

  // Разделяем персонажей по уровням
  const primaryChars = INITIAL_CHARACTERS.filter(
    (char) => char.level === 'primary'
  );
  const secondaryChars = INITIAL_CHARACTERS.filter(
    (char) => char.level === 'secondary'
  );
  const tertiaryChars = INITIAL_CHARACTERS.filter(
    (char) => char.level === 'tertiary'
  );

  // Размещаем primary персонажей в центре
  primaryChars.forEach((char, index) => {
    const radius = 50; // Маленький радиус для центральных персонажей
    const angle = (2 * Math.PI * index) / primaryChars.length;
    positions[char.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // Размещаем secondary персонажей по среднему кругу
  secondaryChars.forEach((char, index) => {
    const radius = 200; // Средний радиус
    const angle = (2 * Math.PI * index) / secondaryChars.length + 0.1;
    // Добавляем небольшое случайное смещение для избежания прямых линий
    const randomOffset = (Math.random() - 0.5) * 25;
    positions[char.id] = {
      x: centerX + (radius + randomOffset) * Math.cos(angle),
      y: centerY + (radius + randomOffset) * Math.sin(angle),
    };
  });

  // Размещаем tertiary персонажей по внешнему кругу
  tertiaryChars.forEach((char, index) => {
    const radius = 350; // Большой радиус
    const angle = (2 * Math.PI * index) / tertiaryChars.length + 0.2;
    // Добавляем небольшое случайное смещение для избежания прямых линий
    const randomOffset = (Math.random() - 0.5) * 50;
    positions[char.id] = {
      x: centerX + (radius + randomOffset) * Math.cos(angle),
      y: centerY + (radius + randomOffset) * Math.sin(angle),
    };
  });

  console.log('positions', positions);

  return positions;
};

// Обновляем конфигурацию графа
const layouts = {
  nodes: calculateInitialPositions(),
  force: {
    enabled: true,
    repulsion: 1200, // Увеличиваем силу отталкивания
    springLength: 200,
    springCoeff: 0.0008,
    dragCoeff: 0.02,
    gravity: 0.4, // Уменьшаем гравитацию для лучшего распределения
    theta: 0.5,
  },
};

// Обновляем конфигурацию графа
const configs = reactive(
  vNG.defineConfigs<VNetworkNode, VNetworkEdge>({
    node: {
      label: {
        visible: true,
        fontSize: 14,
        color: () => themeVars.value.textColor1,
      },
      normal: {
        radius: 20,
      },
    },
    edge: {
      type: 'curve',
      gap: 40,
      normal: {
        width: 2,
        color: (edge: VNetworkEdge) => {
          console.log('edge', edge);
          const customEdge = edge as unknown as Edge;
          const relation = customEdge.relation as keyof typeof RELATION_COLORS;
          return RELATION_COLORS[relation] || '#808080';
        },
        linecap: 'round',
        animate: true,
      },
    },
  })
);

const relationTypeOptions = Object.entries(RELATION_TYPES).map(
  ([_key, value]) => ({
    label: value,
    value: value,
  })
);

const handleEdgeClick = (event: EdgeEvent<MouseEvent>) => {
  if (!event.edge) return;

  // Сохраняем координаты клика
  popoverX.value = event.event.clientX;
  popoverY.value = event.event.clientY;

  const edge = edges.value[event.edge];
  if (edge) {
    selectedEdge.value = { ...edge, id: event.edge };
    showEdgeEditor.value = true;
  }
};

const eventHandlers: EventHandlers = {
  'node:click': (event: NodeEvent<MouseEvent>) => {
    console.log('node:click', event.node, isCreatingEdge.value);

    if (!isCreatingEdge.value) return;

    selectedNodes.value.push(event.node);

    console.log('handleNodeClick', selectedNodes.value);
    if (selectedNodes.value.length === 2) {
      createNewEdge();
    }
  },
  'edge:click': handleEdgeClick,
};

// Методы

const createNewEdge = () => {
  const newEdgeId = `edge${Object.keys(edges.value).length + 1}`;
  edges.value = {
    ...edges.value,
    [newEdgeId]: {
      id: newEdgeId,
      source: selectedNodes.value[0],
      target: selectedNodes.value[1],
      relation: 'новая связь',
    },
  };

  console.log('edges', edges.value);

  resetEdgeCreation();
};

const startCreatingEdge = () => {
  console.log('starting');

  isCreatingEdge.value = true;
  selectedNodes.value = [];
};

const resetEdgeCreation = () => {
  console.log('reset');
  isCreatingEdge.value = false;
  selectedNodes.value = [];
};

const updateEdge = () => {
  if (selectedEdge.value) {
    edges.value = {
      ...edges.value,
      [selectedEdge.value.id]: {
        id: selectedEdge.value.id,
        source: selectedEdge.value.source,
        target: selectedEdge.value.target,
        relation: selectedEdge.value.relation,
      },
    };
    showEdgeEditor.value = false;
    selectedEdge.value = null;
  }
};

const deleteEdge = () => {
  if (selectedEdge.value) {
    const { [selectedEdge.value.id]: removed, ...rest } = edges.value;
    edges.value = rest;
    showEdgeEditor.value = false;
    selectedEdge.value = null;
  }
};
</script>

<template>
  <NCard>
    <NSpace vertical>
      <NSpace>
        <NButton
          :type="isCreatingEdge ? 'primary' : 'default'"
          @click="startCreatingEdge"
        >
          <template #icon>
            <NIcon><Add /></NIcon>
          </template>
          Добавить связь
        </NButton>
      </NSpace>

      <VNetworkGraph
        :nodes="nodes"
        :edges="edges"
        :layouts="layouts"
        :configs="configs"
        :event-handlers="eventHandlers"
      >
        <template #edge-label="{ edge, ...slotProps }">
          <v-edge-label
            :text="edge.label"
            align="center"
            vertical-align="above"
            v-bind="slotProps"
          />
        </template>
      </VNetworkGraph>

      <!-- Редактор связи -->
      <NPopover
        v-model:show="showEdgeEditor"
        trigger="manual"
        :x="popoverX"
        :y="popoverY"
        placement="bottom"
      >
        <template #trigger>
          <div
            style="
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            "
          />
        </template>

        <NSpace vertical>
          <NSelect
            v-if="selectedEdge"
            v-model:value="selectedEdge.relation"
            :options="relationTypeOptions"
            placeholder="Выберите тип связи"
          />
          <NSpace>
            <NButton size="small" type="primary" @click="updateEdge">
              Сохранить
            </NButton>
            <NButton size="small" type="error" @click="deleteEdge">
              Удалить
            </NButton>
            <NButton size="small" @click="showEdgeEditor = false">
              Отмена
            </NButton>
          </NSpace>
        </NSpace>
      </NPopover>

      <!-- Добавляем легенду -->
      <Legend :relationColors="relationColors" :isDarkTheme="isDarkTheme" />
    </NSpace>
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

.n-popover {
  max-width: 300px;
}
</style>
