<script lang="ts" setup>
import {
  NCollapse,
  NCollapseItem,
  NList,
  NListItem,
  NSpin,
  NSpace,
  NButton,
  NInput,
  NAlert,
  NModal,
  NForm,
  NFormItem,
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NText,
  NDropdown,
  NSelect,
} from 'naive-ui';
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useBookPrivateStore } from '@/modules/book/book.store';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_TYPE } from '@/modules/project/project.const';
import { Chapter, Stage } from '@/modules/book/book.types';
import { useI18n } from 'vue-i18n';
import { ChapterID, StageID, BookID } from '@/core/id';
import NotionEditor from '@/modules/book/components/NotionEditor.vue';

const { t } = useI18n();
const bookStore = useBookPrivateStore();
const projectStore = useProjectStore();

// Состояние загрузки
const loading = ref(true);
const loadingChaptersText = ref(false);

// Выбранные элементы
const selectedChapterId = ref<ChapterID | null>(null);
const selectedStageId = ref<StageID | null>(null);

// Модальные окна для добавления/редактирования
const showAddChapterModal = ref(false);
const showEditChapterModal = ref(false);
const showSelectStageModal = ref(false);

// Формы добавления/редактирования
const newChapter = ref({
  title: '',
  description: '',
});

const editingChapter = ref<Chapter | null>(null);

const selectedStageIds = ref<StageID[]>([]);

// Текст главы
const chapterTextContent = ref('');
const isChapterTextDirty = ref(false);

// Методы для работы с главами
const handleAddChapter = () => {
  if (!bookStore.currentBookId) return;

  const chapter = bookStore.addChapter({
    title: newChapter.value.title,
    description: newChapter.value.description || '',
    bookId: bookStore.currentBookId as BookID,
    stageIds: [],
  });

  showAddChapterModal.value = false;
  newChapter.value = { title: '', description: '' };

  // Выбираем созданную главу
  selectedChapterId.value = chapter.id;
};

const handleEditChapter = () => {
  if (!editingChapter.value || !selectedChapterId.value) return;

  bookStore.updateChapter(selectedChapterId.value, {
    title: editingChapter.value.title,
    description: editingChapter.value.description,
  });

  showEditChapterModal.value = false;
  editingChapter.value = null;
};

const startEditChapter = (chapter: Chapter) => {
  editingChapter.value = { ...chapter };
  showEditChapterModal.value = true;
};

const handleDeleteChapter = (chapterId: ChapterID) => {
  if (confirm(t('book.chapter.confirmDelete'))) {
    bookStore.deleteChapter(chapterId);

    if (selectedChapterId.value === chapterId) {
      selectedChapterId.value = null;
      selectedStageId.value = null;
    }
  }
};

const handleDeleteStage = (stageId: StageID) => {
  if (confirm(t('book.stage.confirmDelete'))) {
    bookStore.deleteStage(stageId);

    if (selectedStageId.value === stageId) {
      selectedStageId.value = null;
    }
  }
};

// Новый метод для добавления выбранных сцен в главу
const handleSelectExistingStages = () => {
  if (!selectedChapterId.value) return;

  // Добавляем выбранные сцены в текущую главу
  selectedStageIds.value.forEach((stageId) => {
    const stage = bookStore.stages.find((s) => s.id === stageId);
    if (stage && selectedChapterId.value) {
      // Если сцена уже привязана к главе, обновляем её
      if (stage.chapterId) {
        bookStore.updateStage(stageId, {
          chapterId: selectedChapterId.value,
        });
      } else {
        // Иначе привязываем сцену к главе
        bookStore.updateStage(stageId, {
          chapterId: selectedChapterId.value,
        });
      }
    }
  });

  selectedStageIds.value = [];
  showSelectStageModal.value = false;
};

// Методы для работы с текстом главы
const loadChapterText = async (chapterId: ChapterID) => {
  // Пропускаем повторную загрузку того же текста
  if (selectedChapterId.value === chapterId && !isChapterTextDirty.value) {
    console.log(`PlanPage: пропускаем повторную загрузку текста главы ${chapterId}`);
    return;
  }

  loadingChaptersText.value = true;
  try {
    console.log(`PlanPage: загрузка текста главы ${chapterId}`);
    const chapterText = await bookStore.loadChapterText(chapterId);
    if (chapterText) {
      chapterTextContent.value = chapterText.content;
      console.log(`PlanPage: текст главы ${chapterId} загружен, длина: ${chapterText.content.length}`);
      isChapterTextDirty.value = false;
    }
  } catch (error) {
    console.error('Error loading chapter text:', error);
  } finally {
    loadingChaptersText.value = false;
  }
};

const saveChapterText = async () => {
  if (!selectedChapterId.value) return;

  try {
    console.log(`PlanPage: сохранение текста главы ${selectedChapterId.value}, длина: ${chapterTextContent.value.length}`);
    await bookStore.saveChapterText({
      id: selectedChapterId.value,
      content: chapterTextContent.value,
      lastModified: new Date(),
    });
    isChapterTextDirty.value = false;
    console.log(`PlanPage: текст главы ${selectedChapterId.value} успешно сохранен`);
  } catch (error) {
    console.error('Error saving chapter text:', error);
  }
};

// Вычисляемые свойства для работы с данными
const chapters = computed(() => {
  const currentId = bookStore.currentBookId;
  console.log(
    `PlanPage: вычисление глав для книги ${currentId || 'не выбрана'}`
  );

  if (!currentId) {
    return [];
  }

  // Получаем главы текущей книги и проверяем их на дубликаты по ID
  const bookChapters = bookStore.getBookChapters;

  // Логирование для отладки
  const chapterIds = bookChapters.map(c => c.id);
  const uniqueIds = new Set(chapterIds);
  if (chapterIds.length !== uniqueIds.size) {
    console.warn(`PlanPage: обнаружены дубликаты ID глав в списке (${chapterIds.length} vs ${uniqueIds.size})`);
  }

  // Убеждаемся, что нет дублирования
  if (bookChapters.length) {
    const chapterMap = new Map<string, number>();
    const duplicates: string[] = [];

    bookChapters.forEach((chapter, index) => {
      if (chapterMap.has(chapter.id)) {
        duplicates.push(`${chapter.id} (${chapter.title})`);
      } else {
        chapterMap.set(chapter.id, index);
      }
    });

    if (duplicates.length > 0) {
      console.warn(`PlanPage: Дублирующиеся главы: ${duplicates.join(', ')}`);
    }
  }

  return bookChapters;
});

const chapterStages = computed(() => {
  if (!selectedChapterId.value) return [];
  return bookStore.getChapterStages(selectedChapterId.value);
});

const selectedChapter = computed(() => {
  if (!selectedChapterId.value) return null;
  return (
    chapters.value.find((c: Chapter) => c.id === selectedChapterId.value) ||
    null
  );
});

const selectedStage = computed(() => {
  if (!selectedStageId.value) return null;
  return (
    chapterStages.value.find((s) => s.id === selectedStageId.value) || null
  );
});

// Получаем все сцены без привязки к главе или из других глав
const availableStages = computed(() => {
  if (!bookStore.currentBookId) return [];

  // Фильтруем сцены, которые не принадлежат текущей главе
  return bookStore.stages
    .filter((stage) => {
      // Включаем сцены, которые не принадлежат никакой главе или принадлежат другим главам
      return (
        !stage.chapterId ||
        (selectedChapterId.value && stage.chapterId !== selectedChapterId.value)
      );
    })
    .map((stage) => ({
      label: stage.title,
      value: stage.id,
      // Добавляем информацию о том, к какой главе принадлежит сцена
      description: stage.chapterId
        ? `Из главы: ${chapters.value.find((c) => c.id === stage.chapterId)?.title || 'Неизвестно'}`
        : 'Без главы',
    }));
});

// Обработчики выбора
const handleChapterSelect = (chapter: Chapter) => {
  // Проверяем, существует ли еще эта глава
  const chapterExists = chapters.value.some(c => c.id === chapter.id);
  if (!chapterExists) {
    console.error(`PlanPage: попытка выбрать несуществующую главу с ID ${chapter.id}`);
    return;
  }

  // Проверяем, не выбрана ли уже эта глава
  if (selectedChapterId.value === chapter.id) {
    console.log(`PlanPage: глава ${chapter.id} уже выбрана, пропускаем повторный выбор`);
    return;
  }

  console.log(`PlanPage: выбор главы ${chapter.id} (${chapter.title})`);
  selectedChapterId.value = chapter.id;

  // Загружаем текст главы
  loadChapterText(chapter.id);

  // Сбрасываем выбранную сцену
  selectedStageId.value = null;
};

const handleStageSelect = (stage: Stage) => {
  selectedStageId.value = stage.id;
};

// Отслеживаем изменения текста
watch(chapterTextContent, (newValue, oldValue) => {
  // Проверяем, действительно ли контент изменился
  // Игнорируем изменения с пустого на пустой HTML
  const isNewEmpty = !newValue || newValue === '<p></p>' || newValue.trim() === '';
  const isOldEmpty = !oldValue || oldValue === '<p></p>' || oldValue.trim() === '';

  if (isNewEmpty && isOldEmpty) {
    return; // Оба значения пустые, не помечаем как измененное
  }

  isChapterTextDirty.value = true;
});

// Обработчик автосохранения
const autoSaveIntervalMs = 10000; // Снижаем до 10 секунд, чтобы чаще сохранять
let autoSaveInterval: number | null = null;

const setupAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  autoSaveInterval = window.setInterval(async () => {
    if (isChapterTextDirty.value && selectedChapterId.value) {
      console.log(`PlanPage: автосохранение текста главы ${selectedChapterId.value}`);
      await saveChapterText();
    }
  }, autoSaveIntervalMs);
};

// Отслеживаем изменение выбранной главы, но добавляем задержку для предотвращения бесконечного цикла
// watch(selectedChapterId, async (newChapterId, oldChapterId) => {
//   console.log(
//     `PlanPage: selectedChapterId изменился с '${oldChapterId}' на '${newChapterId}'`
//   );

//   // Никаких действий, если ID главы не изменился
//   if (newChapterId === oldChapterId) {
//     console.log('PlanPage: ID главы не изменился, пропускаем обработку');
//     return;
//   }

//   // Проверяем, существует ли новая глава
//   if (newChapterId && !chapters.value.some(c => c.id === newChapterId)) {
//     console.error(`PlanPage: попытка выбрать несуществующую главу с ID ${newChapterId}`);
//     // Сбрасываем выбор, если глава больше не существует
//     selectedChapterId.value = null;
//     return;
//   }

//   // Сохраняем текст текущей главы перед переключением на новую
//   if (oldChapterId && isChapterTextDirty.value) {
//     console.log(`PlanPage: сохраняем текст главы ${oldChapterId} перед переключением`);
//     try {
//       await bookStore.saveChapterText({
//         id: oldChapterId,
//         content: chapterTextContent.value,
//         lastModified: new Date(),
//       });
//       isChapterTextDirty.value = false;
//     } catch (error) {
//       console.error(`PlanPage: ошибка при сохранении текста главы ${oldChapterId}:`, error);
//     }
//   }

//   if (newChapterId) {
//     // Загружаем текст для новой главы
//     try {
//       await loadChapterText(newChapterId);
//     } catch (error) {
//       console.error(`PlanPage: ошибка при загрузке текста главы ${newChapterId}:`, error);
//     }

//     // Сбрасываем выбранную сцену
//     selectedStageId.value = null;

//     // Проверяем сцены для этой главы
//     const stages = chapterStages.value;
//     console.log(
//       `PlanPage: найдено ${stages.length} сцен для главы ${newChapterId}`
//     );

//     // Автоматически выбираем первую сцену, если она есть
//     if (stages.length > 0) {
//       selectedStageId.value = stages[0].id;
//       console.log(
//         `PlanPage: автоматически выбрана первая сцена: ${stages[0].id}`
//       );
//     }
//   }
// });

// Наблюдение за изменением текущей книги
// watch(
//   () => bookStore.currentBookId,
//   async (newBookId, oldBookId) => {
//     console.log(
//       `PlanPage: currentBookId изменился с '${oldBookId}' на '${newBookId}'`
//     );

//     // Сохраняем текущий текст главы перед сменой книги
//     if (selectedChapterId.value && isChapterTextDirty.value) {
//       console.log(`PlanPage: сохраняем текст главы ${selectedChapterId.value} перед сменой книги`);
//       await bookStore.saveChapterText({
//         id: selectedChapterId.value,
//         content: chapterTextContent.value,
//         lastModified: new Date(),
//       });
//       isChapterTextDirty.value = false;
//     }

//     if (newBookId && newBookId !== oldBookId) {
//       // Сбрасываем выбранные элементы
//       selectedChapterId.value = null;
//       selectedStageId.value = null;
//       chapterTextContent.value = '';

//       // Принудительно загружаем главы для новой книги
//       console.log(
//         `PlanPage: принудительная загрузка глав для новой книги: ${newBookId}`
//       );

//       // Даем время реактивной системе обновить компьютед-свойства
//       await new Promise((resolve) => setTimeout(resolve, 100));

//       const currentChapters = chapters.value;
//       console.log(
//         `PlanPage: после смены книги найдено ${currentChapters.length} глав`
//       );

//       if (currentChapters.length > 0) {
//         selectedChapterId.value = currentChapters[0].id;
//         console.log(`PlanPage: выбрана первая глава: ${currentChapters[0].id}`);
//         // Загружаем текст этой главы
//         await loadChapterText(currentChapters[0].id);
//       }
//     }
//   },
//   { immediate: true }
// );

// Инициализация страницы
onMounted(async () => {
  try {
    loading.value = true;

    // Загружаем данные если необходимо
    await bookStore.loadBooks();
    await bookStore.loadChapters();
    await bookStore.loadStages();

    const currentProject = projectStore.currentProject;

    if (
      currentProject &&
      currentProject.type === PROJECT_TYPE.SINGLE_BOOK &&
      bookStore.books.length > 0
    ) {
      // Для одиночной книги, устанавливаем первую книгу как текущую
      bookStore.setCurrentBook(bookStore.books[0].id);
    } else if (currentProject && currentProject.type === PROJECT_TYPE.SERIES) {
      console.log('currentProject.currentBookId', currentProject.currentBookId);

      if (currentProject.currentBookId) {
        bookStore.setCurrentBook(currentProject.currentBookId);
      } else {
        // Для серии, проверяем первую серию на наличие книг
        const firstSeries = bookStore.series[0];
        if (firstSeries.books.length > 0) {
          // Устанавливаем первую книгу серии как текущую
          bookStore.setCurrentBook(firstSeries.books[0].id);
        }
      }
    }

    // Даем время на обновление вычисляемых свойств после установки текущей книги
    await new Promise(resolve => setTimeout(resolve, 200));

    // Если есть главы и текущая книга выбрана, выбираем первую главу для отображения
    if (bookStore.currentBookId && chapters.value.length > 0) {
      // Устанавливаем выбранную главу и принудительно загружаем её текст
      console.log('PlanPage onMounted: Выбираем первую главу и загружаем её текст');
      selectedChapterId.value = chapters.value[0].id;

      try {
        const chapterText = await bookStore.loadChapterText(chapters.value[0].id);
        if (chapterText) {
          chapterTextContent.value = chapterText.content;
          console.log(`PlanPage onMounted: Текст главы загружен, длина: ${chapterText.content.length}`);
          isChapterTextDirty.value = false;
        }
      } catch (error) {
        console.error('Error loading chapter text on mount:', error);
      }
    }

    // Настраиваем автосохранение
    setupAutoSave();
  } catch (error) {
    console.error('Error initializing plan page:', error);
  } finally {
    loading.value = false;
  }
});

// Обработчик при размонтировании компонента
onBeforeUnmount(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  // Сохраняем несохраненные изменения перед закрытием страницы
  if (isChapterTextDirty.value && selectedChapterId.value) {
    console.log(`PlanPage: сохранение текста главы ${selectedChapterId.value} перед закрытием страницы`);
    saveChapterText();
  }
});
</script>

<template>
  <div class="plan-container">
    <NAlert
      v-if="!bookStore.currentBookId"
      type="error"
      style="margin-bottom: 16px"
    >
      {{ t('book.errors.noCurrentBook') }}
    </NAlert>

    <NSpin :show="loading">
      <NLayout has-sider>
        <!-- Боковая панель с главами и сценами -->
        <NLayoutSider
          collapse-mode="width"
          :collapsed-width="64"
          :width="280"
          show-trigger
          bordered
        >
          <div class="sidebar-content">
            <div class="sidebar-header">
              <NSpace justify="space-between">
                <NText strong>{{ t('book.chapters') }}</NText>
                <NButton
                  size="small"
                  @click="showAddChapterModal = true"
                  :disabled="!bookStore.currentBookId"
                >
                  {{ t('common.add') }}
                </NButton>
              </NSpace>
            </div>

            <div class="chapters-list">
              <NCollapse>
                <NCollapseItem
                  v-for="chapter in chapters"
                  :key="chapter.id"
                  :title="chapter.title"
                  :class="{
                    'selected-chapter': selectedChapterId === chapter.id,
                  }"
                  @click="handleChapterSelect(chapter)"
                >
                  <!-- Инструменты управления главой -->
                  <template #header-extra>
                    <NDropdown
                      trigger="click"
                      :options="[
                        {
                          label: t('common.edit'),
                          key: 'edit',
                          onClick: () => startEditChapter(chapter),
                        },
                        {
                          label: t('common.delete'),
                          key: 'delete',
                          onClick: () => handleDeleteChapter(chapter.id),
                        },
                      ]"
                      @click.stop
                    >
                      <div class="chapter-tools">
                        <span class="tool-icon">⋮</span>
                      </div>
                    </NDropdown>
                  </template>

                  <!-- Список сцен -->
                  <div class="stages-header">
                    <NSpace justify="space-between">
                      <NText>{{ t('book.stages') }}</NText>
                      <NSpace>
                        <NButton
                          size="small"
                          @click.stop="
                            showSelectStageModal = true;
                            selectedChapterId = chapter.id;
                          "
                          :disabled="!bookStore.currentBookId"
                        >
                          {{ t('book.stage.select') }}
                        </NButton>
                      </NSpace>
                    </NSpace>
                  </div>

                  <NList hoverable clickable>
                    <NListItem
                      v-for="stage in bookStore.getChapterStages(chapter.id)"
                      :key="stage.id"
                      @click.stop="handleStageSelect(stage)"
                      :class="{
                        'selected-stage': selectedStageId === stage.id,
                      }"
                    >
                      <NSpace justify="space-between" align="center">
                        <span>{{ stage.title }}</span>
                        <NSpace>
                          <NButton
                            size="small"
                            @click.stop="handleDeleteStage(stage.id)"
                          >
                            {{ t('common.delete') }}
                          </NButton>
                        </NSpace>
                      </NSpace>
                    </NListItem>

                    <NListItem
                      v-if="bookStore.getChapterStages(chapter.id).length === 0"
                    >
                      <em>{{ t('book.empty.stages') }}</em>
                    </NListItem>
                  </NList>
                </NCollapseItem>
              </NCollapse>

              <div v-if="chapters.length === 0" class="empty-message">
                <NText depth="3">{{ t('book.empty.chapters') }}</NText>
              </div>
            </div>
          </div>
        </NLayoutSider>

        <!-- Основное содержимое - детали сцены или редактор текста главы -->
        <NLayoutContent class="main-content">
          <NSpin :show="loadingChaptersText">
            <div v-if="selectedChapterId" class="chapter-editor">
              <div class="chapter-editor-header">
                <NSpace justify="space-between" align="center">
                  <h3>{{ selectedChapter?.title }}</h3>
                </NSpace>

                <!-- Описание главы и сцены, если выбрана -->
                <div v-if="selectedChapter?.description" class="description">
                  <NText depth="3">{{ selectedChapter.description }}</NText>
                </div>

                <div v-if="selectedStage" class="stage-details">
                  <h4>{{ selectedStage.title }}</h4>
                  <div v-if="selectedStage.description" class="description">
                    <NText depth="3">{{ selectedStage.description }}</NText>
                  </div>
                </div>
              </div>

              <!-- Редактор текста главы -->
              <div class="chapter-text-editor">
                <NotionEditor
                  v-model="chapterTextContent"
                  :placeholder="t('book.writeHere')"
                />
              </div>
            </div>

            <div v-else class="empty-editor">
              <NText depth="3">{{ t('book.selectChapter') }}</NText>
            </div>
          </NSpin>
        </NLayoutContent>
      </NLayout>
    </NSpin>

    <!-- Модальные окна -->
    <!-- Добавление главы -->
    <NModal
      v-model:show="showAddChapterModal"
      :title="t('book.chapter.add')"
      preset="dialog"
      positive-text="Добавить"
      negative-text="Отмена"
      @positive-click="handleAddChapter"
    >
      <NForm>
        <NFormItem :label="t('book.title')" required>
          <NInput v-model:value="newChapter.title" />
        </NFormItem>
        <NFormItem :label="t('book.description')">
          <NInput v-model:value="newChapter.description" type="textarea" />
        </NFormItem>
      </NForm>
    </NModal>

    <!-- Редактирование главы -->
    <NModal
      v-model:show="showEditChapterModal"
      :title="t('book.chapter.edit')"
      preset="dialog"
      positive-text="Сохранить"
      negative-text="Отмена"
      @positive-click="handleEditChapter"
    >
      <NForm v-if="editingChapter">
        <NFormItem :label="t('book.title')" required>
          <NInput v-model:value="editingChapter.title" />
        </NFormItem>
        <NFormItem :label="t('book.description')">
          <NInput v-model:value="editingChapter.description" type="textarea" />
        </NFormItem>
      </NForm>
    </NModal>

    <!-- Модальное окно выбора существующих сцен -->
    <NModal
      v-model:show="showSelectStageModal"
      :title="t('book.stage.select')"
      preset="dialog"
      positive-text="Добавить выбранные"
      negative-text="Отмена"
      @positive-click="handleSelectExistingStages"
    >
      <NForm>
        <NFormItem :label="t('book.stage.selectExisting')">
          <NSelect
            v-model:value="selectedStageIds"
            filterable
            multiple
            :options="availableStages"
            :placeholder="t('book.stage.searchPlaceholder')"
          />
        </NFormItem>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped>
.plan-container {
  height: 100%;
  width: 100%;
}

.book-selector {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #eee;
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.chapters-list {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.selected-chapter {
  background-color: rgba(0, 128, 255, 0.1);
}

.selected-stage {
  background-color: rgba(0, 128, 255, 0.05);
}

.chapter-tools {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.chapter-tools:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.tool-icon {
  font-weight: bold;
}

.stages-header {
  margin: 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
}

.main-content {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

.chapter-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chapter-editor-header {
  margin-bottom: 16px;
}

.chapter-text-editor {
  flex: 1;
}

.description {
  margin: 8px 0;
  font-style: italic;
}

.stage-details {
  margin-top: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.empty-message,
.empty-editor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
}
</style>
