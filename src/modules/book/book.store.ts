import { defineStore } from 'pinia';
import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { IAuthor, IBookSeries, ISingleBook } from './book.types';
import { PROJECT_LIMITS } from '../settings/settings.limits';
import * as fs from '@tauri-apps/plugin-fs';
import { useProjectStore } from '../project/project.store';
import { ref, watch, computed } from 'vue';

export const BOOK_STORE = 'book';

// Пути к файлам относительно директории проекта
const BOOK_DATA = {
  BOOKS: 'books.json',
  SERIES: 'series.json',
  AUTHORS: 'authors.json',
} as const;

export const useBookPrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${BOOK_STORE}`,
  () => {
    const books = ref<ISingleBook[]>([]);
    const series = ref<IBookSeries[]>([]);
    const authors = ref<IAuthor[]>([]);
    const projectStore = useProjectStore();

    const canAddBook = computed(() =>
      books.value.length < PROJECT_LIMITS.BOOKS.MAX_BOOKS_PER_PROJECT
    );

    const canAddSeries = computed(() =>
      series.value.length < PROJECT_LIMITS.BOOKS.MAX_SERIES_PER_PROJECT
    );

    const canAddAuthor = computed(() =>
      authors.value.length < PROJECT_LIMITS.BOOKS.MAX_AUTHORS_PER_BOOK
    );

    // Загрузка данных
    const loadBooks = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const booksPath = `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS}`;
        const exists = await fs.exists(booksPath);

        if (!exists) {
          await fs.writeTextFile(booksPath, JSON.stringify([], null, 2));
        }

        const booksJson = await fs.readTextFile(booksPath);
        books.value = JSON.parse(booksJson);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    const loadSeries = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const seriesPath = `${projectStore.currentProject.path}/${BOOK_DATA.SERIES}`;
        const exists = await fs.exists(seriesPath);

        if (!exists) {
          await fs.writeTextFile(seriesPath, JSON.stringify([], null, 2));
        }

        const seriesJson = await fs.readTextFile(seriesPath);
        series.value = JSON.parse(seriesJson);
      } catch (error) {
        console.error('Error loading series:', error);
      }
    };

    const loadAuthors = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const authorsPath = `${projectStore.currentProject.path}/${BOOK_DATA.AUTHORS}`;
        const exists = await fs.exists(authorsPath);

        if (!exists) {
          await fs.writeTextFile(authorsPath, JSON.stringify([], null, 2));
        }

        const authorsJson = await fs.readTextFile(authorsPath);
        authors.value = JSON.parse(authorsJson);
      } catch (error) {
        console.error('Error loading authors:', error);
      }
    };

    // Сохранение данных
    const saveBooks = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS}`,
          JSON.stringify(books.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving books:', error);
      }
    };

    const saveSeries = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/${BOOK_DATA.SERIES}`,
          JSON.stringify(series.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving series:', error);
      }
    };

    const saveAuthors = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/${BOOK_DATA.AUTHORS}`,
          JSON.stringify(authors.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving authors:', error);
      }
    };

    // CRUD операции
    const addBook = (book: ISingleBook) => {
      if (!canAddBook.value) {
        return false;
      }
      books.value.push(book);
      return true;
    };

    const addSeries = (newSeries: IBookSeries) => {
      if (!canAddSeries.value) {
        return false;
      }
      series.value.push(newSeries);
      return true;
    };

    const addAuthor = (author: IAuthor) => {
      if (!canAddAuthor.value) {
        return false;
      }
      authors.value.push(author);
      return true;
    };

    const updateBook = (updatedBook: ISingleBook) => {
      const index = books.value.findIndex(book => book.id === updatedBook.id);
      if (index !== -1) {
        books.value[index] = updatedBook;
      }
    };

    const updateSeries = (updatedSeries: IBookSeries) => {
      const index = series.value.findIndex(s => s.id === updatedSeries.id);
      if (index !== -1) {
        series.value[index] = updatedSeries;
      }
    };

    const updateAuthor = (updatedAuthor: IAuthor) => {
      const index = authors.value.findIndex(author => author.id === updatedAuthor.id);
      if (index !== -1) {
        authors.value[index] = updatedAuthor;
      }
    };

    const deleteBook = (bookId: string) => {
      const index = books.value.findIndex(book => book.id === bookId);
      if (index !== -1) {
        books.value.splice(index, 1);
        return true;
      }
      return false;
    };

    const deleteSeries = (seriesId: string) => {
      const index = series.value.findIndex(s => s.id === seriesId);
      if (index !== -1) {
        series.value.splice(index, 1);
        return true;
      }
      return false;
    };

    const deleteAuthor = (authorId: string) => {
      const index = authors.value.findIndex(author => author.id === authorId);
      if (index !== -1) {
        authors.value.splice(index, 1);
        return true;
      }
      return false;
    };

    // Отслеживание изменений проекта
    watch(() => projectStore.currentProject?.path, () => {
      loadBooks();
      loadSeries();
      loadAuthors();
    }, { immediate: true });

    // Отслеживание изменений данных
    watch(books, saveBooks, { deep: true });
    watch(series, saveSeries, { deep: true });
    watch(authors, saveAuthors, { deep: true });

    // Функции поиска
    const findBooksByAuthor = (authorId: string) => {
      return books.value.filter(book =>
        book.authors.some(author => author.id === authorId)
      );
    };

    const findBooksBySeries = (seriesId: string) => {
      return series.value.filter(itemSeries =>
        itemSeries.id === seriesId
      );
    };

    const findSeriesByAuthor = (authorId: string) => {
      return series.value.filter(itemSeries =>
        itemSeries.authors.some(author => author.id === authorId)
      );
    };

    return {
      books,
      series,
      authors,
      addBook,
      addSeries,
      addAuthor,
      updateBook,
      updateSeries,
      updateAuthor,
      canAddBook,
      canAddSeries,
      canAddAuthor,
      findBooksByAuthor,
      findBooksBySeries,
      findSeriesByAuthor,
      deleteBook,
      deleteSeries,
      deleteAuthor,
      loadBooks,
      loadSeries,
      loadAuthors,
    };
  }
);

export const useBookStore = defineStore(BOOK_STORE, () => {
  const privateStore = useBookPrivateStore();

  return {
    books: privateStore.books,
    series: privateStore.series,
    authors: privateStore.authors,
    addBook: privateStore.addBook,
    addSeries: privateStore.addSeries,
    addAuthor: privateStore.addAuthor,
    updateBook: privateStore.updateBook,
    updateSeries: privateStore.updateSeries,
    updateAuthor: privateStore.updateAuthor,
    canAddBook: privateStore.canAddBook,
    canAddSeries: privateStore.canAddSeries,
    canAddAuthor: privateStore.canAddAuthor,
    findBooksByAuthor: privateStore.findBooksByAuthor,
    findBooksBySeries: privateStore.findBooksBySeries,
    findSeriesByAuthor: privateStore.findSeriesByAuthor,
    deleteBook: privateStore.deleteBook,
    deleteSeries: privateStore.deleteSeries,
    deleteAuthor: privateStore.deleteAuthor,
    loadBooks: privateStore.loadBooks,
    loadSeries: privateStore.loadSeries,
    loadAuthors: privateStore.loadAuthors,
  };
});
