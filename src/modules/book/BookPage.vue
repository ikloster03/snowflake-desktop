<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { NFlex, NTabs, NTabPane, NButton, NSpace, NModal } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useBookStore } from './book.store';
import { ISingleBook, IBookSeries, IAuthor } from './book.types';
import BookForm from './components/BookForm.vue';
import SeriesForm from './components/SeriesForm.vue';
import AuthorForm from './components/AuthorForm.vue';
import BookList from './components/BookList.vue';
import SeriesList from './components/SeriesList.vue';
import AuthorList from './components/AuthorList.vue';

const { t } = useI18n();
const bookStore = useBookStore();

const activeTab = ref('books');
const showAddBookModal = ref(false);
const showAddSeriesModal = ref(false);
const showAddAuthorModal = ref(false);

// Ссылки на компоненты форм
const bookFormRef = ref<any>(null);
const seriesFormRef = ref<any>(null);
const authorFormRef = ref<any>(null);

onMounted(async () => {
  await bookStore.loadBooks();
  await bookStore.loadSeries();
  await bookStore.loadAuthors();
});

const handleAddBook = (book: ISingleBook): void => {
  console.log('handleAddBook', book);
  try {
    if (bookStore.addBook(book)) {
      showAddBookModal.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleAddSeries = (series: IBookSeries): void => {
  try {
    if (bookStore.addSeries(series)) {
      showAddSeriesModal.value = false;
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

          <BookList
            v-if="bookStore.books"
            :books="bookStore.books"
            @delete="handleDeleteBook"
          />
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

          <SeriesList
            v-if="bookStore.series"
            :series="bookStore.series"
            @delete="handleDeleteSeries"
          />
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

          <AuthorList
            v-if="bookStore.authors"
            :authors="bookStore.authors"
            @delete="handleDeleteAuthor"
          />
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
