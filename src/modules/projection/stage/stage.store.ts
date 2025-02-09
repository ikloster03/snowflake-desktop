import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Stage } from './stage.types';
import { STAGE_STATUS } from './stage.const';

export const useStageStore = defineStore('stage', () => {
  const stages = ref<Stage[]>([
    {
      id: '1-1',
      title: 'Этап 1: Пробуждение героя',
      description: 'Главный герой просыпается и обнаруживает необычные способности',
      chapterId: '1',
      characterIds: ['char1'],
      status: STAGE_STATUS.COMPLETED,
      order: 1
    },
    {
      id: '1-2',
      title: 'Этап 2: Встреча с наставником',
      description: 'Происходит важная встреча с будущим наставником',
      chapterId: '1',
      characterIds: ['char1', 'char2'],
      status: 'in_progress',
      order: 2
    },
    {
      id: '2-1',
      title: 'Этап 1: В дороге',
      description: 'Начало путешествия',
      chapterId: '2',
      characterIds: ['char1'],
      status: 'draft',
      order: 1
    },
    {
      id: '2-2',
      title: 'Этап 2: Первое испытание',
      description: 'Герой сталкивается с первым серьезным испытанием',
      chapterId: '2',
      characterIds: ['char1', 'char2'],
      status: 'draft',
      order: 2
    }
  ]);

  // Геттеры
  const getStagesByChapter = computed(() => (chapterId: string) => {
    return stages.value
      .filter(stage => stage.chapterId === chapterId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  const getStageById = computed(() => (id: string) => {
    return stages.value.find(stage => stage.id === id);
  });

  // Действия
  const addStage = (stage: Omit<Stage, 'id'>) => {
    const newStage: Stage = {
      ...stage,
      id: crypto.randomUUID(),
      order: stages.value.filter(s => s.chapterId === stage.chapterId).length + 1
    };
    stages.value.push(newStage);
  };

  const updateStage = (id: string, updates: Partial<Stage>) => {
    const index = stages.value.findIndex(stage => stage.id === id);
    if (index !== -1) {
      stages.value[index] = { ...stages.value[index], ...updates };
    }
  };

  const deleteStage = (id: string) => {
    const index = stages.value.findIndex(stage => stage.id === id);
    if (index !== -1) {
      stages.value.splice(index, 1);
      // Пересчитываем порядок для оставшихся сцен в той же главе
      const chapterId = stages.value[index]?.chapterId;
      if (chapterId) {
        stages.value
          .filter(stage => stage.chapterId === chapterId)
          .forEach((stage, idx) => {
            stage.order = idx + 1;
          });
      }
    }
  };

  const reorderStages = (newOrder: string[]) => {
    newOrder.forEach((stageId, index) => {
      const stage = stages.value.find(s => s.id === stageId);
      if (stage) {
        stage.order = index + 1;
      }
    });
  };

  return {
    stages,
    getStagesByChapter,
    getStageById,
    addStage,
    updateStage,
    deleteStage,
    reorderStages
  };
});
