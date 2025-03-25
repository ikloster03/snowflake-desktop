<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue';
import {
  NFlex,
  NTabs,
  NTabPane,
  NButton,
  NSpace,
  NModal,
  NSpin,
  NAlert,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useBookPrivateStore } from './book.store';
import { ISingleBook, IBookSeries, IAuthor } from './book.types';
import { useProjectStore } from '../project/project.store';
import { PROJECT_TYPE } from '../project/project.const';
import { useRouter } from 'vue-router';
import { BOOK_EDITOR_PAGE, SERIES_EDITOR_PAGE, PLAN_PAGE } from './book.const';
import BookForm from './components/BookForm.vue';
import SeriesForm from './components/SeriesForm.vue';
import AuthorForm from './components/AuthorForm.vue';
import BookList from './components/BookList.vue';
import SeriesList from './components/SeriesList.vue';
import AuthorList from './components/AuthorList.vue';

const { t } = useI18n();
const bookStore = useBookPrivateStore();
const projectStore = useProjectStore();
const router = useRouter();

const activeTab = ref('books');
const showAddBookModal = ref(false);
const showAddSeriesModal = ref(false);
const showAddAuthorModal = ref(false);

// Индикаторы загрузки
const loadingBooks = ref(true);
const loadingSeries = ref(true);
const loadingAuthors = ref(true);

// Состояния проекта
const redirected = ref(false);
const redirectionError = ref<string | null>(null);

// Ссылки на компоненты форм
const bookFormRef = ref<any>(null);
const seriesFormRef = ref<any>(null);
const authorFormRef = ref<any>(null);

// Логика перенаправления в зависимости от типа проекта
const redirectBasedOnProjectType = () => {
  if (redirected.value) return;

  const currentProject = projectStore.currentProject;
  if (!currentProject) {
    redirectionError.value = 'Нет открытого проекта';
    return;
  }

  try {
    // Проверяем тип проекта
    if (currentProject.type === PROJECT_TYPE.SINGLE_BOOK) {
      // Для одиночной книги, проверяем есть ли хотя бы одна книга
      if (bookStore.books.length > 0) {
        const firstBook = bookStore.books[0];

        // Устанавливаем эту книгу как текущую (для плана)
        bookStore.setCurrentBook(firstBook.id);

        // Перенаправляем на редактор книги
        router.push({
          name: BOOK_EDITOR_PAGE.name,
          params: { id: firstBook.id },
        });
        redirected.value = true;
      }
    } else if (currentProject.type === PROJECT_TYPE.SERIES) {
      // Для серии, проверяем есть ли хотя бы одна серия
      if (bookStore.series.length > 0) {
        const firstSeries = bookStore.series[0];

        // Если в серии есть книги, устанавливаем первую как текущую (для плана)
        if (firstSeries.books.length > 0) {
          bookStore.setCurrentBook(firstSeries.books[0].id);
        }

        // Перенаправляем на редактор серии
        router.push({
          name: SERIES_EDITOR_PAGE.name,
          params: { id: firstSeries.id },
        });
        redirected.value = true;
      }
    }
  } catch (error) {
    console.error('Ошибка при перенаправлении:', error);
    redirectionError.value =
      error instanceof Error ? error.message : 'Неизвестная ошибка';
  }
};

onMounted(async () => {
  try {
    loadingBooks.value = true;
    loadingSeries.value = true;
    loadingAuthors.value = true;

    await bookStore.loadBooks();
    loadingBooks.value = false;

    await bookStore.loadSeries();
    loadingSeries.value = false;

    await bookStore.loadAuthors();
    loadingAuthors.value = false;

    // После загрузки данных пытаемся перенаправить пользователя
    redirectBasedOnProjectType();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  } finally {
    loadingBooks.value = false;
    loadingSeries.value = false;
    loadingAuthors.value = false;
  }
});

// Наблюдаем за изменениями в книгах и сериях для автоматического перенаправления
watchEffect(() => {
  if (!redirected.value && !loadingBooks.value && !loadingSeries.value) {
    redirectBasedOnProjectType();
  }
});

const handleAddBook = (book: ISingleBook): void => {
  console.log('handleAddBook', book);
  try {
    if (bookStore.addBook(book)) {
      showAddBookModal.value = false;

      // Если это проект с одиночной книгой и это первая книга, перенаправляем на редактирование
      if (
        projectStore.currentProject?.type === PROJECT_TYPE.SINGLE_BOOK &&
        bookStore.books.length === 1
      ) {
        router.push({
          name: BOOK_EDITOR_PAGE.name,
          params: { id: book.id },
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleAddSeries = (series: IBookSeries): void => {
  try {
    if (bookStore.addSeries(series)) {
      showAddSeriesModal.value = false;

      // Если это проект с серией и это первая серия, перенаправляем на редактирование
      if (
        projectStore.currentProject?.type === PROJECT_TYPE.SERIES &&
        bookStore.series.length === 1
      ) {
        router.push({
          name: SERIES_EDITOR_PAGE.name,
          params: { id: series.id },
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleAddAuthor = (author: IAuthor): void => {
  try {
    if (bookStore.addAuthor(author)) {
      showAddAuthorModal.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteBook = (bookId: string): void => {
  try {
    if (bookStore.deleteBook(bookId)) {
      // Можно добавить уведомление об успешном удалении
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteSeries = (seriesId: string): void => {
  try {
    if (bookStore.deleteSeries(seriesId)) {
      // Можно добавить уведомление об успешном удалении
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteAuthor = (authorId: string): void => {
  try {
    if (bookStore.deleteAuthor(authorId)) {
      // Можно добавить уведомление об успешном удалении
    }
  } catch (error) {
    console.error(error);
  }
};

// Функции для обработки клика по кнопкам 'Сохранить'
const handleBookSave = (): void => {
  console.log('BookPage: handleBookSave clicked');
  bookFormRef.value?.submitForm();
};

const handleSeriesSave = (): void => {
  console.log('BookPage: handleSeriesSave clicked');
  seriesFormRef.value?.submitForm();
};

const handleAuthorSave = (): void => {
  console.log('BookPage: handleAuthorSave clicked');
  authorFormRef.value?.submitForm();
};
</script>

<template>
  <NFlex vertical>
    <h1>{{ t('book-editor') }}</h1>

    <!-- Сообщение об ошибке перенаправления, если есть -->
    <NAlert v-if="redirectionError" type="error" style="margin-bottom: 16px">
      {{ redirectionError }}
    </NAlert>

    <NTabs v-model:value="activeTab">
      <NTabPane name="books" :tab="t('book.tabs.books')">
        <NSpace vertical>
          <NButton
            @click="showAddBookModal = true"
            :disabled="!bookStore.canAddBook"
            type="primary"
          >
            {{ t('book.actions.add') }}
          </NButton>

          <NSpin :show="loadingBooks">
            <div v-if="!loadingBooks && bookStore.books.length > 0">
              <BookList :books="bookStore.books" @delete="handleDeleteBook" />
            </div>
            <div v-else-if="!loadingBooks && bookStore.books.length === 0">
              {{ t('book.empty.books') }}
            </div>
          </NSpin>
        </NSpace>
      </NTabPane>

      <NTabPane name="series" :tab="t('book.tabs.series')">
        <NSpace vertical>
          <NButton
            @click="showAddSeriesModal = true"
            :disabled="!bookStore.canAddSeries"
            type="primary"
          >
            {{ t('book.actions.addSeries') }}
          </NButton>

          <NSpin :show="loadingSeries">
            <div v-if="!loadingSeries && bookStore.series.length > 0">
              <SeriesList
                :series="bookStore.series"
                @delete="handleDeleteSeries"
              />
            </div>
            <div v-else-if="!loadingSeries && bookStore.series.length === 0">
              {{ t('book.empty.series') }}
            </div>
          </NSpin>
        </NSpace>
      </NTabPane>

      <NTabPane name="authors" :tab="t('book.tabs.authors')">
        <NSpace vertical>
          <NButton
            @click="showAddAuthorModal = true"
            :disabled="!bookStore.canAddAuthor"
            type="primary"
          >
            {{ t('book.actions.addAuthor') }}
          </NButton>

          <NSpin :show="loadingAuthors">
            <div v-if="!loadingAuthors && bookStore.authors.length > 0">
              <AuthorList
                :authors="bookStore.authors"
                @delete="handleDeleteAuthor"
              />
            </div>
            <div v-else-if="!loadingAuthors && bookStore.authors.length === 0">
              {{ t('book.empty.authors') }}
            </div>
          </NSpin>
        </NSpace>
      </NTabPane>
    </NTabs>

    <NModal
      v-model:show="showAddBookModal"
      :title="t('book.actions.add')"
      preset="card"
      style="width: 600px"
      :mask-closable="false"
    >
      <BookForm ref="bookFormRef" @submit="handleAddBook" />
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAddBookModal = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            type="primary"
            @click="handleBookSave"
            :disabled="!bookStore.canAddBook"
          >
            {{ t('common.save') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <NModal
      v-model:show="showAddSeriesModal"
      :title="t('book.actions.addSeries')"
      preset="card"
      style="width: 600px"
      :mask-closable="false"
    >
      <SeriesForm ref="seriesFormRef" @submit="handleAddSeries" />
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAddSeriesModal = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            type="primary"
            @click="handleSeriesSave"
            :disabled="!bookStore.canAddSeries"
          >
            {{ t('common.save') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <NModal
      v-model:show="showAddAuthorModal"
      :title="t('book.actions.addAuthor')"
      preset="card"
      style="width: 600px"
      :mask-closable="false"
    >
      <AuthorForm ref="authorFormRef" @submit="handleAddAuthor" />
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAddAuthorModal = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            type="primary"
            @click="handleAuthorSave"
            :disabled="!bookStore.canAddAuthor"
          >
            {{ t('common.save') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </NFlex>
</template>
