<script lang="ts" setup>
import { createID } from '@/core/id';
import { ref, computed, onMounted, h } from 'vue';
import {
  NCard,
  NSpace,
  NDataTable,
  NButton,
  NInput,
  NSelect,
  NModal,
  NForm,
  NFormItem,
  NDivider,
  NEmpty,
  NPopconfirm,
  useMessage,
} from 'naive-ui';
import { useBookStore } from '@/modules/book/book.store';
import type { DataTableColumns } from 'naive-ui';
import type { Stage } from '@/modules/book/book.types';
import { STAGE_STATUS } from './stage.const';
import {
  Add20Filled as AddIcon,
  Edit20Filled as EditIcon,
  Delete20Filled as DeleteIcon,
} from '@vicons/fluent';

const bookStore = useBookStore();
const message = useMessage();

// Состояние
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedStageId = ref<string | null>(null);
const isLoading = ref(true);
const isSharedMode = ref(false);
const searchQuery = ref('');

// Модельные данные для новой сцены
const newStage = ref({
  title: '',
  description: '',
  chapterId: undefined,
  characterIds: [] as string[],
  status: STAGE_STATUS.DRAFT,
  seriesId: undefined,
});

// Вычисляемые свойства
const isSeriesProject = computed(() => bookStore.series.length > 0);

const filteredStages = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return bookStore.stages.filter((stage) => {
    if (!query) return true;
    return (
      stage.title.toLowerCase().includes(query) ||
      (stage.description || '').toLowerCase().includes(query)
    );
  });
});

const chapterOptions = computed(() => {
  return bookStore.chapters.map((chapter) => ({
    label: chapter.title,
    value: chapter.id,
  }));
});

const characterOptions = computed(() => {
  return bookStore.authors.map((author) => ({
    label: author.firstName + ' ' + author.lastName,
    value: author.id,
  }));
});

const seriesOptions = computed(() => {
  return bookStore.series.map((series) => ({
    label: series.title,
    value: series.id,
  }));
});

const statusOptions = computed(() => {
  return Object.entries(STAGE_STATUS).map(([_, value]) => ({
    label:
      value === STAGE_STATUS.DRAFT
        ? 'Черновик'
        : value === STAGE_STATUS.IN_PROGRESS
          ? 'В процессе'
          : value === STAGE_STATUS.COMPLETED
            ? 'Завершено'
            : value,
    value: value,
  }));
});

// Столбцы таблицы
const columns = computed<DataTableColumns<Stage>>(() => [
  {
    title: 'Название',
    key: 'title',
    sorter: 'default',
  },
  {
    title: 'Описание',
    key: 'description',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: 'Глава',
    key: 'chapterId',
    render(row) {
      const chapter = bookStore.chapters.find((c) => c.id === row.chapterId);
      return chapter ? chapter.title : 'Без главы';
    },
    sorter(row1, row2) {
      const a = row1.chapterId || '';
      const b = row2.chapterId || '';
      return a.localeCompare(b);
    },
  },
  {
    title: 'Статус',
    key: 'status',
    render(row) {
      if (row.status === STAGE_STATUS.DRAFT) return 'Черновик';
      if (row.status === STAGE_STATUS.IN_PROGRESS) return 'В процессе';
      if (row.status === STAGE_STATUS.COMPLETED) return 'Завершено';
      return row.status || 'Не указан';
    },
    sorter(row1, row2) {
      const a = row1.status || '';
      const b = row2.status || '';
      return a.localeCompare(b);
    },
  },
  {
    title: 'Действия',
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        { justify: 'center', align: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                onClick: () => handleEditStage(row.id),
              },
              { icon: () => h(EditIcon) }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteStage(row.id),
              },
              {
                default: () => 'Вы уверены, что хотите удалить эту сцену?',
                trigger: () =>
                  h(
                    NButton,
                    {
                      quaternary: true,
                      circle: true,
                    },
                    { icon: () => h(DeleteIcon) }
                  ),
              }
            ),
          ],
        }
      );
    },
  },
]);

// Методы
const loadData = async () => {
  isLoading.value = true;
  await bookStore.loadStages();
  isLoading.value = false;
};

const resetNewStage = () => {
  newStage.value = {
    title: '',
    description: '',
    chapterId: undefined,
    characterIds: [],
    status: STAGE_STATUS.DRAFT,
    seriesId: undefined,
  };
};

const handleCreateStage = () => {
  if (!newStage.value.title.trim()) {
    message.error('Название сцены не может быть пустым');
    return;
  }

  try {
    // Если включен режим общих сцен для серии и выбрана серия
    if (isSharedMode.value && newStage.value.seriesId) {
      bookStore.addStage({
        ...newStage.value,
        seriesId: createID('Series')(newStage.value.seriesId),
        chapterId: newStage.value.chapterId
          ? createID('Chapter')(newStage.value.chapterId)
          : undefined,
        characterIds: newStage.value.characterIds.map((id) =>
          createID('Character')(id)
        ),
      });
    } else {
      bookStore.addStage({
        ...newStage.value,
        chapterId: newStage.value.chapterId
          ? createID('Chapter')(newStage.value.chapterId)
          : undefined,
        characterIds: newStage.value.characterIds.map((id) =>
          createID('Character')(id)
        ),
      });
    }

    isCreateModalOpen.value = false;
    resetNewStage();
    message.success('Сцена успешно создана');
  } catch (error) {
    console.error('Ошибка при создании сцены:', error);
    message.error('Не удалось создать сцену');
  }
};

const handleEditStage = (stageId: string) => {
  const stage = bookStore.stages.find((s) => s.id === stageId);
  if (!stage) return;

  selectedStageId.value = stageId;

  newStage.value = {
    title: stage.title,
    description: stage.description || '',
    chapterId: stage.chapterId ? String(stage.chapterId) : undefined,
    characterIds: stage.characterIds?.map((id) => String(id)) || [],
    status: stage.status || STAGE_STATUS.DRAFT,
    seriesId: stage.seriesId ? String(stage.seriesId) : undefined,
  };

  isSharedMode.value = !!stage.seriesId;
  isEditModalOpen.value = true;
};

const handleUpdateStage = () => {
  if (!selectedStageId.value) return;
  if (!newStage.value.title.trim()) {
    message.error('Название сцены не может быть пустым');
    return;
  }

  try {
    if (isSharedMode.value && newStage.value.seriesId) {
      bookStore.updateStage(createID('Stage')(selectedStageId.value), {
        title: newStage.value.title,
        description: newStage.value.description,
        chapterId: newStage.value.chapterId
          ? createID('Chapter')(newStage.value.chapterId)
          : undefined,
        characterIds: newStage.value.characterIds.map((id) =>
          createID('Character')(id)
        ),
        status: newStage.value.status,
        seriesId: createID('Series')(newStage.value.seriesId),
      });
    } else {
      bookStore.updateStage(createID('Stage')(selectedStageId.value), {
        title: newStage.value.title,
        description: newStage.value.description,
        chapterId: newStage.value.chapterId
          ? createID('Chapter')(newStage.value.chapterId)
          : undefined,
        characterIds: newStage.value.characterIds.map((id) =>
          createID('Character')(id)
        ),
        status: newStage.value.status,
        seriesId: undefined,
      });
    }

    isEditModalOpen.value = false;
    selectedStageId.value = null;
    message.success('Сцена успешно обновлена');
  } catch (error) {
    console.error('Ошибка при обновлении сцены:', error);
    message.error('Не удалось обновить сцену');
  }
};

const handleDeleteStage = (stageId: string) => {
  try {
    bookStore.deleteStage(createID('Stage')(stageId));
    message.success('Сцена успешно удалена');
  } catch (error) {
    console.error('Ошибка при удалении сцены:', error);
    message.error('Не удалось удалить сцену');
  }
};

const handleCreateClick = () => {
  resetNewStage();
  isSharedMode.value = false;
  isCreateModalOpen.value = true;
};

const toggleSharedMode = () => {
  if (!isSharedMode.value) {
    newStage.value.seriesId = undefined;
  }
};

// Загрузка данных при монтировании
onMounted(async () => {
  await Promise.all([
    bookStore.loadStages(),
    bookStore.loadChapters(),
    bookStore.loadAuthors(),
    bookStore.loadSeries(),
  ]);
  isLoading.value = false;
});
</script>

<template>
  <NCard>
    <NSpace vertical>
      <NSpace justify="space-between">
        <h2>Управление сценами</h2>
        <NButton type="primary" @click="handleCreateClick">
          <template #icon>
            <AddIcon />
          </template>
          Добавить сцену
        </NButton>
      </NSpace>

      <NDivider />

      <NInput
        v-model:value="searchQuery"
        placeholder="Поиск по названию или описанию..."
        clearable
      />

      <NDataTable
        :columns="columns"
        :data="filteredStages"
        :loading="isLoading"
        :pagination="{
          pageSize: 10,
        }"
        :row-key="(row) => row.id"
      />

      <!-- Модальное окно создания сцены -->
      <NModal
        v-model:show="isCreateModalOpen"
        title="Создание новой сцены"
        preset="card"
        style="width: 600px"
      >
        <NForm>
          <NFormItem label="Название" required>
            <NInput
              v-model:value="newStage.title"
              placeholder="Введите название сцены"
            />
          </NFormItem>

          <NFormItem label="Описание">
            <NInput
              v-model:value="newStage.description"
              type="textarea"
              placeholder="Введите описание сцены"
            />
          </NFormItem>

          <NFormItem label="Статус">
            <NSelect
              v-model:value="newStage.status"
              :options="statusOptions"
              placeholder="Выберите статус"
            />
          </NFormItem>

          <NFormItem v-if="isSeriesProject" label="Общая сцена для серии">
            <NSelect
              v-if="isSharedMode"
              v-model:value="newStage.seriesId"
              :options="seriesOptions"
              placeholder="Выберите серию"
            />
            <div>
              <NButton
                :type="isSharedMode ? 'primary' : 'default'"
                @click="
                  isSharedMode = !isSharedMode;
                  toggleSharedMode();
                "
              >
                {{
                  isSharedMode
                    ? 'Это общая сцена для серии'
                    : 'Сделать общей для серии'
                }}
              </NButton>
            </div>
          </NFormItem>

          <NFormItem label="Глава">
            <NSelect
              v-model:value="newStage.chapterId"
              :options="chapterOptions"
              placeholder="Выберите главу"
              clearable
            />
          </NFormItem>

          <NFormItem label="Персонажи">
            <NSelect
              v-model:value="newStage.characterIds"
              :options="characterOptions"
              placeholder="Выберите персонажей"
              multiple
              clearable
            />
          </NFormItem>

          <NSpace justify="end">
            <NButton @click="isCreateModalOpen = false">Отмена</NButton>
            <NButton type="primary" @click="handleCreateStage">Создать</NButton>
          </NSpace>
        </NForm>
      </NModal>

      <!-- Модальное окно редактирования сцены -->
      <NModal
        v-model:show="isEditModalOpen"
        title="Редактирование сцены"
        preset="card"
        style="width: 600px"
      >
        <NForm>
          <NFormItem label="Название" required>
            <NInput
              v-model:value="newStage.title"
              placeholder="Введите название сцены"
            />
          </NFormItem>

          <NFormItem label="Описание">
            <NInput
              v-model:value="newStage.description"
              type="textarea"
              placeholder="Введите описание сцены"
            />
          </NFormItem>

          <NFormItem label="Статус">
            <NSelect
              v-model:value="newStage.status"
              :options="statusOptions"
              placeholder="Выберите статус"
            />
          </NFormItem>

          <NFormItem v-if="isSeriesProject" label="Общая сцена для серии">
            <NSelect
              v-if="isSharedMode"
              v-model:value="newStage.seriesId"
              :options="seriesOptions"
              placeholder="Выберите серию"
            />
            <div>
              <NButton
                :type="isSharedMode ? 'primary' : 'default'"
                @click="
                  isSharedMode = !isSharedMode;
                  toggleSharedMode();
                "
              >
                {{
                  isSharedMode
                    ? 'Это общая сцена для серии'
                    : 'Сделать общей для серии'
                }}
              </NButton>
            </div>
          </NFormItem>

          <NFormItem label="Глава">
            <NSelect
              v-model:value="newStage.chapterId"
              :options="chapterOptions"
              placeholder="Выберите главу"
              clearable
            />
          </NFormItem>

          <NFormItem label="Персонажи">
            <NSelect
              v-model:value="newStage.characterIds"
              :options="characterOptions"
              placeholder="Выберите персонажей"
              multiple
              clearable
            />
          </NFormItem>

          <NSpace justify="end">
            <NButton @click="isEditModalOpen = false">Отмена</NButton>
            <NButton type="primary" @click="handleUpdateStage"
              >Сохранить</NButton
            >
          </NSpace>
        </NForm>
      </NModal>
    </NSpace>
  </NCard>
</template>

<style scoped>
.n-space {
  width: 100%;
}
</style>
