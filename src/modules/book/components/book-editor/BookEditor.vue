<script lang="ts" setup>
import { NCard, NSpace, NButton, NModal, NAlert } from 'naive-ui';
import { ref, computed, onMounted, watch } from 'vue';
import { useBookPrivateStore } from '../../book.store';
import { useI18n } from 'vue-i18n';
import BookForm from '../BookForm.vue';
import { ISingleBook } from '../../book.types';
import { useRoute, useRouter } from 'vue-router';
import { BOOK_PAGE } from '../../book.const';
import { useProjectStore } from '@/modules/project/project.store';
import { useMessage } from 'naive-ui';
import { open } from '@tauri-apps/plugin-dialog';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useBookPrivateStore();
const projectStore = useProjectStore();
const message = useMessage();

// Получаем ID книги из маршрута
const bookId = computed(() => route.params.id as string);

// Находим книгу по ID
const book = computed(() => {
  return store.books.find((book) => book.id === bookId.value);
});

// Загружаем главы для текущей книги
const loadBookData = async () => {
  if (bookId.value) {
    await store.loadBookChapters(bookId.value);
  }
};

// Загружаем данные при монтировании и при изменении bookId
onMounted(loadBookData);
watch(bookId, loadBookData);

// Состояние формы
const formRef = ref<{ submitForm: () => void } | null>(null);
const isEditing = ref(false);
const showDeleteConfirm = ref(false);

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

const handleUpdate = (updatedBook: ISingleBook) => {
  store.updateBook(updatedBook);
  isEditing.value = false;
};

const handleDelete = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = () => {
  if (store.deleteBook(bookId.value)) {
    router.push({ name: BOOK_PAGE.name });
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

// Обработчик обратно к списку
const handleBack = () => {
  router.push({ name: BOOK_PAGE.name });
};

const handleExportBook = async () => {
  if (!book.value) return;

  try {
    // Показываем лоадер сразу при начале процесса экспорта
    message.loading(t('book.export.loading'), { duration: 0 });

    // Открываем диалог выбора директории
    const selectedDirectory = await open({
      directory: true,
      multiple: false,
      title: t('book.export.saveTitle'),
    });

    // Если пользователь отменил выбор директории
    if (!selectedDirectory) {
      message.destroyAll();
      return;
    }

    await store.exportBookToWord(book.value.id, selectedDirectory as string);

    // Убираем лоадер и показываем успех
    message.destroyAll();
    message.success(t('book.export.success'));
  } catch (error) {
    // Убираем лоадер и показываем ошибку
    message.destroyAll();

    message.error(error instanceof Error ? error.message : t('book.export.error'));
    console.error('Export error:', error);
  }
};
</script>

<template>
  <div class="book-editor-container">
    <NSpace vertical size="large">
      <NSpace justify="space-between">
        <NButton
          v-if="projectStore.currentProject?.type === 'series'"
          @click="handleBack"
        >
          {{ t('common.back') }}
        </NButton>
        <div v-else>
          Книга {{ book?.title }} без серии
        </div>
        <NSpace v-if="!isEditing">
          <NButton type="primary" @click="handleEdit">
            {{ t('common.edit') }}
          </NButton>
          <NButton
            secondary
            :disabled="!book || !store.canExportBook(book.id)"
            @click="handleExportBook"
          >
            {{ t('book.export.button') }}
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

      <NAlert v-if="!book" type="error">
        {{ t('book.errors.notFound') }}
      </NAlert>

      <div v-else>
        <!-- Режим просмотра -->
        <NCard v-if="!isEditing">
          <template #header>
            <div class="book-header">
              <h2>{{ book.title }}</h2>
            </div>
          </template>

          <div class="book-info">
            <div class="book-field">
              <div class="book-label">{{ t('book.description') }}:</div>
              <div class="book-value">
                {{ book.description || t('book.empty.description') }}
              </div>
            </div>

            <div class="book-field">
              <div class="book-label">{{ t('book.genresTitle') }}:</div>
              <div class="book-value">
                {{
                  book.genres.length
                    ? book.genres
                        .map((genre) => t(`book.genres.${genre.toLowerCase()}`))
                        .join(', ')
                    : t('book.empty.genres')
                }}
              </div>
            </div>

            <div class="book-field">
              <div class="book-label">{{ t('book.statusLabel') }}:</div>
              <div class="book-value">
                {{ t(`book.status.${book.status.toLowerCase()}`) }}
              </div>
            </div>

            <div class="book-field">
              <div class="book-label">{{ t('book.authors') }}:</div>
              <div class="book-value">
                {{
                  book.authors.length
                    ? book.authors.map((author) => author.titleName).join(', ')
                    : t('book.empty.authors')
                }}
              </div>
            </div>

            <div class="book-field" v-if="book.publicationDate">
              <div class="book-label">{{ t('book.publicationDate') }}:</div>
              <div class="book-value">{{ book.publicationDate }}</div>
            </div>
          </div>
        </NCard>

        <!-- Режим редактирования -->
        <NCard v-else>
          <BookForm ref="formRef" :initialData="book" @submit="handleUpdate" />
        </NCard>
      </div>
    </NSpace>

    <!-- Модальное окно подтверждения удаления -->
    <NModal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      :title="t('book.deletion.title')"
      :content="t('book.deletion.content')"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel')"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    />
  </div>
</template>

<style scoped>
.book-editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.book-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.book-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-label {
  font-weight: bold;
  color: var(--text-color-2);
}

.book-value {
  color: var(--text-color-1);
}
</style>
