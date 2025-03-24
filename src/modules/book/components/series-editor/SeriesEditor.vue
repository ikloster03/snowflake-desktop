<script lang="ts" setup>
import {
  NCard,
  NSpace,
  NButton,
  NModal,
  useDialog,
  NAlert,
  NTabs,
  NTabPane,
  NDataTable,
} from 'naive-ui';
import { ref, computed, h } from 'vue';
import { useBookPrivateStore } from '../../book.store';
import { useI18n } from 'vue-i18n';
import SeriesForm from '../SeriesForm.vue';
import { IBookSeries, ISingleBook, IBookInSeries } from '../../book.types';
import { useRoute, useRouter } from 'vue-router';
import { BOOK_PAGE, BOOK_EDITOR_PAGE, SERIES_TYPES } from '../../book.const';
import { BookID, compareIDs, createID } from '@/core/id';
import { useProjectStore } from '@/modules/project/project.store';
import { PROJECT_TYPE } from '@/modules/project/project.const';

const { t } = useI18n();
const dialog = useDialog();
const router = useRouter();
const route = useRoute();
const store = useBookPrivateStore();
const projectStore = useProjectStore();

// Получаем ID серии из маршрута
const seriesId = computed(() => route.params.id as string);

// Находим серию по ID
const series = computed(() => {
  return store.series.find((s) => s.id === seriesId.value);
});

// Получаем книги из этой серии
const seriesBooks = computed(() => series.value?.books || []);

// Состояние формы
const formRef = ref<{ submitForm: () => void } | null>(null);
const isEditing = ref(false);
const showDeleteConfirm = ref(false);
const showAddBookModal = ref(false);

// Активная вкладка
const activeTab = ref('details');

// Проверка типа проекта
const isSeriesType = computed(() => {
  return projectStore.currentProject?.type === PROJECT_TYPE.SERIES;
});

// Функция проверки, является ли книга текущей
const isCurrentBook = (bookId: BookID): boolean => {
  const project = projectStore.currentProject;
  if (!project || !project.currentBookId) return false;

  return compareIDs(bookId, project.currentBookId);
};

// Состояние сохранения проекта
const isSaving = ref(false);

// Обработчик сохранения проекта
const handleSaveProject = async () => {
  try {
    isSaving.value = true;
    await projectStore.saveCurrentProject();
    dialog.success({
      title: t('project.saveSuccess.title'),
      content: t('project.saveSuccess.content'),
      positiveText: t('common.ok'),
    });
  } catch (error) {
    dialog.error({
      title: t('project.saveError.title'),
      content: t('project.saveError.content'),
      positiveText: t('common.ok'),
    });
    console.error('Ошибка сохранения проекта:', error);
  } finally {
    isSaving.value = false;
  }
};

// Обработчики событий
const handleEdit = () => {
  isEditing.value = true;
};

const handleCancel = () => {
  isEditing.value = false;
};

const handleSave = () => {
  formRef.value?.submitForm();
};

const handleUpdate = (updatedSeries: IBookSeries) => {
  // Проверка, можно ли изменить тип проекта на SERIES, если тип изменился
  const currentType = projectStore.currentProject?.type;
  const hasManyBooks = updatedSeries.books && updatedSeries.books.length > 1;

  if (currentType === PROJECT_TYPE.SINGLE_BOOK && hasManyBooks) {
    dialog.warning({
      title: t('book.series.errors.cantChangeTitleType'),
      content: t('book.series.errors.removeExtraBooks'),
      positiveText: t('common.ok'),
    });
    return;
  }

  store.updateSeries(updatedSeries);
  isEditing.value = false;

  // Если у нас проект типа SINGLE_BOOK и в серии ровно одна книга,
  // автоматически устанавливаем её как текущую
  if (
    projectStore.currentProject?.type === PROJECT_TYPE.SINGLE_BOOK &&
    updatedSeries.books &&
    updatedSeries.books.length === 1
  ) {
    projectStore.setCurrentBook(createID<'Book'>(updatedSeries.books[0].id));
  }

  // Автоматически сохраняем проект после обновления серии
  handleSaveProject();
};

const handleDelete = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = () => {
  if (store.deleteSeries(seriesId.value)) {
    router.push({ name: BOOK_PAGE.name });
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

// Переход к редактированию книги
const handleEditBook = (bookId: string) => {
  router.push({
    name: BOOK_EDITOR_PAGE.name,
    params: { id: bookId },
  });
};

// Колонки для таблицы книг
const bookColumns = computed(() => [
  {
    title: t('book.title'),
    key: 'title',
    render: (row: IBookInSeries) => {
      if (isCurrentBook(row.id)) {
        // Отмечаем текущую книгу в серии
        return h(
          'div',
          { style: 'display: flex; align-items: center; gap: 8px' },
          [
            h(
              'span',
              { style: 'font-weight: bold; color: var(--primary-color)' },
              row.title
            ),
            h(
              'span',
              {
                style:
                  'font-size: 0.8em; color: var(--primary-color); background-color: var(--primary-color-hover); padding: 2px 6px; border-radius: 4px;',
              },
              t('book.series.currentBook')
            ),
          ]
        );
      }
      return row.title;
    },
  },
  {
    title: t('book.order'),
    key: 'orderInSeries',
  },
  {
    title: t('book.status'),
    key: 'status',
    render: (row: IBookInSeries) =>
      t(`book.status.${row.status.toLowerCase()}`),
  },
  {
    title: t('common.actions'),
    key: 'actions',
    render: (row: IBookInSeries) => {
      const buttons = [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => handleEditBook(row.id),
          },
          { default: () => t('common.edit') }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            onClick: () => handleRemoveBookFromSeries(row.id),
          },
          { default: () => t('common.remove') }
        ),
      ];

      // Добавление кнопки "Выбрать как текущую" только для SERIES
      if (isSeriesType.value && !isCurrentBook(row.id)) {
        buttons.push(
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              onClick: () => handleSetCurrentBook(row.id),
            },
            { default: () => t('book.series.setAsCurrent') }
          )
        );
      }

      return h(NSpace, {}, { default: () => buttons });
    },
  },
]);

// Удаление книги из серии
const handleRemoveBookFromSeries = (bookId: string) => {
  if (!series.value) return;

  // Проверяем, является ли эта книга текущей книгой проекта
  const isBookCurrent = isCurrentBook(createID<'Book'>(bookId));

  dialog.warning({
    title: t('book.series.removeBook.title'),
    content: isBookCurrent
      ? t('book.series.removeBook.contentCurrentBook')
      : t('book.series.removeBook.content'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      const updatedSeries = {
        ...series.value!,
        books: series.value!.books.filter((book) => book.id !== bookId),
      };

      // Если это была текущая книга, сбрасываем текущую книгу проекта
      if (isBookCurrent) {
        // Создаем пустой ID для сброса
        const emptyBookId = createID<'Book'>();
        projectStore.setCurrentBook(emptyBookId);

        // Если после удаления в серии осталась только одна книга и это проект SINGLE_BOOK,
        // автоматически делаем её текущей
        if (
          projectStore.currentProject?.type === PROJECT_TYPE.SINGLE_BOOK &&
          updatedSeries.books &&
          updatedSeries.books.length === 1
        ) {
          projectStore.setCurrentBook(
            createID<'Book'>(updatedSeries.books[0].id)
          );
        }
      }

      store.updateSeries(updatedSeries);

      // Автоматически сохраняем проект после удаления книги
      handleSaveProject();
    },
  });
};

// Добавление книги в серию
const handleAddBookToSeries = () => {
  // Если проект типа SINGLE_BOOK и уже есть книга, выводим предупреждение
  if (
    projectStore.currentProject?.type === PROJECT_TYPE.SINGLE_BOOK &&
    series.value?.books &&
    series.value.books.length > 0
  ) {
    dialog.warning({
      title: t('book.series.errors.singleBookProject'),
      content: t('book.series.errors.onlyOneBook'),
      positiveText: t('common.ok'),
    });
    return;
  }

  showAddBookModal.value = true;
};

// Получаем книги, которые не входят в серию
const availableBooks = computed(() => {
  if (!series.value) return [];
  const seriesBookIds = series.value.books.map((book) => book.id);
  return store.books.filter((book) => !seriesBookIds.includes(book.id));
});

// Добавление выбранной книги в серию
const selectedBookId = ref<string | null>(null);

const confirmAddBook = () => {
  if (!selectedBookId.value || !series.value) {
    showAddBookModal.value = false;
    return;
  }

  const bookToAdd = store.books.find(
    (book) => book.id === selectedBookId.value
  );
  if (!bookToAdd) {
    showAddBookModal.value = false;
    return;
  }

  const updatedSeries = {
    ...series.value,
    books: [
      ...series.value.books,
      {
        ...bookToAdd,
        seriesId: series.value.id,
        orderInSeries: series.value.books.length + 1,
      },
    ],
  };

  store.updateSeries(updatedSeries);

  // Если это первая книга в проекте типа SINGLE_BOOK, автоматически устанавливаем её как текущую
  if (
    projectStore.currentProject?.type === PROJECT_TYPE.SINGLE_BOOK &&
    updatedSeries.books.length === 1
  ) {
    projectStore.setCurrentBook(createID<'Book'>(bookToAdd.id));
  }

  selectedBookId.value = null;
  showAddBookModal.value = false;

  // Автоматически сохраняем проект после добавления книги
  handleSaveProject();
};

// Установка текущей книги в проекте
const handleSetCurrentBook = (bookId: string) => {
  projectStore.setCurrentBook(createID<'Book'>(bookId));

  // Автоматически сохраняем проект после изменения текущей книги
  handleSaveProject();
};

// Обработчик обратно к списку
const handleBack = () => {
  router.push({ name: BOOK_PAGE.name });
};
</script>

<template>
  <div class="series-editor-container">
    <NSpace vertical size="large">
      <NSpace justify="space-between">
        <NButton @click="handleBack">
          {{ t('common.back') }}
        </NButton>

        <NSpace>
          <NButton
            type="primary"
            @click="handleSaveProject"
            :loading="isSaving"
            :disabled="!projectStore.currentProject"
          >
            {{ t('project.save') }}
          </NButton>
        </NSpace>
      </NSpace>

      <NSpace justify="space-between">
        <NSpace v-if="!isEditing">
          <NButton type="primary" @click="handleEdit">
            {{ t('common.edit') }}
          </NButton>
          <NButton type="error" @click="handleDelete">
            {{ t('common.delete') }}
          </NButton>
        </NSpace>
        <NSpace v-else>
          <NButton @click="handleCancel">
            {{ t('common.cancel') }}
          </NButton>
          <NButton type="primary" @click="handleSave">
            {{ t('common.save') }}
          </NButton>
        </NSpace>
      </NSpace>

      <NAlert v-if="!series" type="error">
        {{ t('book.series.errors.notFound') }}
      </NAlert>

      <div v-else>
        <!-- Заголовок серии -->
        <NCard>
          <template #header>
            <div class="series-header">
              <h2>{{ series.title }}</h2>
              <div class="series-type">
                {{ t(`book.series.types.${series.type.toLowerCase()}`) }}
              </div>
            </div>
          </template>
        </NCard>

        <!-- Вкладки: детали серии и книги -->
        <NTabs v-model:value="activeTab">
          <!-- Вкладка "Детали серии" -->
          <NTabPane name="details" :tab="t('book.series.details')">
            <!-- Режим просмотра -->
            <NCard v-if="!isEditing">
              <div class="series-info">
                <div class="series-field">
                  <div class="series-label">
                    {{ t('book.series.description') }}:
                  </div>
                  <div class="series-value">
                    {{ series.description || t('book.empty.description') }}
                  </div>
                </div>

                <div class="series-field">
                  <div class="series-label">{{ t('book.series.type') }}:</div>
                  <div class="series-value">
                    {{ t(`book.series.types.${series.type.toLowerCase()}`) }}
                  </div>
                </div>

                <div class="series-field">
                  <div class="series-label">{{ t('book.authors') }}:</div>
                  <div class="series-value">
                    {{
                      series.authors.length
                        ? series.authors
                            .map((author) => author.titleName)
                            .join(', ')
                        : t('book.empty.authors')
                    }}
                  </div>
                </div>
              </div>
            </NCard>

            <!-- Режим редактирования -->
            <NCard v-else>
              <SeriesForm
                ref="formRef"
                :initialData="series"
                @submit="handleUpdate"
              />
            </NCard>
          </NTabPane>

          <!-- Вкладка "Книги" -->
          <NTabPane name="books" :tab="t('book.series.books')">
            <NSpace vertical>
              <NButton
                @click="handleAddBookToSeries"
                type="primary"
                :disabled="availableBooks.length === 0"
              >
                {{ t('book.series.addBook') }}
              </NButton>

              <NCard v-if="seriesBooks.length === 0">
                <div class="empty-books">
                  {{ t('book.series.empty.books') }}
                </div>
              </NCard>

              <NDataTable
                v-else
                :columns="bookColumns"
                :data="seriesBooks"
                :pagination="{ pageSize: 10 }"
              />
            </NSpace>
          </NTabPane>
        </NTabs>
      </div>
    </NSpace>

    <!-- Модальное окно подтверждения удаления -->
    <NModal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      :title="t('book.series.deletion.title')"
      :content="t('book.series.deletion.content')"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel')"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    />

    <!-- Модальное окно добавления книги в серию -->
    <NModal
      v-model:show="showAddBookModal"
      :title="t('book.series.addBook')"
      preset="dialog"
      style="width: 500px"
    >
      <NAlert v-if="availableBooks.length === 0" type="info">
        {{ t('book.series.noAvailableBooks') }}
      </NAlert>

      <div v-else>
        <NDataTable
          :columns="[
            {
              type: 'selection',
              multiple: false,
            },
            {
              title: t('book.title'),
              key: 'title',
            },
          ]"
          :data="availableBooks"
          :row-key="(row) => row.id"
          @update:checked-row-keys="
            (keys) => (selectedBookId = String(keys[0]))
          "
        />
      </div>

      <template #action>
        <NSpace justify="end">
          <NButton @click="showAddBookModal = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            type="primary"
            @click="confirmAddBook"
            :disabled="!selectedBookId"
          >
            {{ t('common.add') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.series-editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.series-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.series-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.series-type {
  font-size: 0.9rem;
  color: var(--text-color-3);
  background-color: var(--primary-color-hover);
  padding: 4px 8px;
  border-radius: 4px;
}

.series-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.series-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.series-label {
  font-weight: bold;
  color: var(--text-color-2);
}

.series-value {
  color: var(--text-color-1);
}

.empty-books {
  text-align: center;
  padding: 20px;
  color: var(--text-color-3);
}
</style>
