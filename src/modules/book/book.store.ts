import { defineStore } from 'pinia';
import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { IAuthor, IBookSeries, ISingleBook, Chapter, Stage, ChapterText } from './book.types';
import { PROJECT_LIMITS } from '../settings/settings.limits';
import * as fs from '@tauri-apps/plugin-fs';
import { useProjectStore } from '../project/project.store';
import { ref, watch, computed } from 'vue';
import { ChapterID, StageID } from '@/core/id';

export const BOOK_STORE = 'book';

// Пути к файлам относительно директории проекта
const BOOK_DATA = {
  BOOKS: 'books.json',
  SERIES: 'series.json',
  AUTHORS: 'authors.json',
  CHAPTERS: 'chapters.json',
  STAGES: 'stages.json',
  CHAPTERS_TEXT: 'chapters_text/', // Директория для текстов глав
} as const;

export const useBookPrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${BOOK_STORE}`,
  () => {
    const books = ref<ISingleBook[]>([]);
    const series = ref<IBookSeries[]>([]);
    const authors = ref<IAuthor[]>([]);
    const chapters = ref<Chapter[]>([]);
    const stages = ref<Stage[]>([]);
    const currentChapterText = ref<ChapterText | null>(null);
    const currentBookId = ref<string | null>(null);
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

    // Загрузка глав
    const loadChapters = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const chaptersPath = `${projectStore.currentProject.path}/${BOOK_DATA.CHAPTERS}`;
        const exists = await fs.exists(chaptersPath);

        if (!exists) {
          await fs.writeTextFile(chaptersPath, JSON.stringify([], null, 2));
        }

        const chaptersJson = await fs.readTextFile(chaptersPath);
        chapters.value = JSON.parse(chaptersJson);
      } catch (error) {
        console.error('Error loading chapters:', error);
      }
    };

    // Загрузка сцен
    const loadStages = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        const stagesPath = `${projectStore.currentProject.path}/${BOOK_DATA.STAGES}`;
        const exists = await fs.exists(stagesPath);

        if (!exists) {
          await fs.writeTextFile(stagesPath, JSON.stringify([], null, 2));
        }

        const stagesJson = await fs.readTextFile(stagesPath);
        stages.value = JSON.parse(stagesJson);
      } catch (error) {
        console.error('Error loading stages:', error);
      }
    };

    // Загрузка текста главы
    const loadChapterText = async (chapterId: ChapterID) => {
      if (!projectStore.currentProject?.path) return null;

      try {
        // Создаем директорию для текстов глав, если она не существует
        const chapterTextDir = `${projectStore.currentProject.path}/${BOOK_DATA.CHAPTERS_TEXT}`;
        const dirExists = await fs.exists(chapterTextDir);

        if (!dirExists) {
          // Создаем директорию с помощью mkdir, так как create не поддерживает опцию dir
          await fs.mkdir(chapterTextDir);
        }

        const chapterTextPath = `${chapterTextDir}/${chapterId}.txt`;
        const exists = await fs.exists(chapterTextPath);

        if (!exists) {
          await fs.writeTextFile(chapterTextPath, '');
          currentChapterText.value = {
            id: chapterId,
            content: '',
            lastModified: new Date()
          };
          return currentChapterText.value;
        }

        const content = await fs.readTextFile(chapterTextPath);
        currentChapterText.value = {
          id: chapterId,
          content,
          lastModified: new Date()
        };

        return currentChapterText.value;
      } catch (error) {
        console.error('Error loading chapter text:', error);
        return null;
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

    const saveChapters = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/${BOOK_DATA.CHAPTERS}`,
          JSON.stringify(chapters.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving chapters:', error);
      }
    };

    const saveStages = async () => {
      if (!projectStore.currentProject?.path) return;

      try {
        await fs.writeTextFile(
          `${projectStore.currentProject.path}/${BOOK_DATA.STAGES}`,
          JSON.stringify(stages.value, null, 2)
        );
      } catch (error) {
        console.error('Error saving stages:', error);
      }
    };

    const saveChapterText = async (chapterText: ChapterText) => {
      if (!projectStore.currentProject?.path) return;

      try {
        // Создаем директорию для текстов глав, если она не существует
        const chapterTextDir = `${projectStore.currentProject.path}/${BOOK_DATA.CHAPTERS_TEXT}`;
        const dirExists = await fs.exists(chapterTextDir);

        if (!dirExists) {
          // Создаем директорию с помощью mkdir, так как create не поддерживает опцию dir
          await fs.mkdir(chapterTextDir);
        }

        await fs.writeTextFile(
          `${chapterTextDir}/${chapterText.id}.txt`,
          chapterText.content
        );

        currentChapterText.value = {
          ...chapterText,
          lastModified: new Date()
        };
      } catch (error) {
        console.error('Error saving chapter text:', error);
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

    // Операции с главами
    const addChapter = (chapter: Omit<Chapter, 'id' | 'order'>) => {
      const bookChapters = chapters.value.filter(c => c.bookId === chapter.bookId);
      const newChapter: Chapter = {
        ...chapter,
        id: crypto.randomUUID() as ChapterID,
        order: bookChapters.length + 1,
        stageIds: []
      };

      chapters.value.push(newChapter);
      saveChapters();
      return newChapter;
    };

    const updateChapter = (chapterId: ChapterID, updates: Partial<Chapter>) => {
      const index = chapters.value.findIndex(chapter => chapter.id === chapterId);
      if (index !== -1) {
        chapters.value[index] = { ...chapters.value[index], ...updates };
        saveChapters();
        return true;
      }
      return false;
    };

    const deleteChapter = (chapterId: ChapterID) => {
      const index = chapters.value.findIndex(chapter => chapter.id === chapterId);
      if (index !== -1) {
        const bookId = chapters.value[index].bookId;
        chapters.value.splice(index, 1);

        // Пересчитываем порядок глав
        const bookChapters = chapters.value.filter(c => c.bookId === bookId);
        bookChapters.forEach((chapter, idx) => {
          chapter.order = idx + 1;
        });

        saveChapters();
        return true;
      }
      return false;
    };

    // Операции со сценами
    const addStage = (stage: Omit<Stage, 'id' | 'order'>) => {
      const chapterStages = stage.chapterId ?
        stages.value.filter(s => s.chapterId === stage.chapterId) : [];

      const newStage: Stage = {
        ...stage,
        id: crypto.randomUUID() as StageID,
        order: chapterStages.length + 1
      };

      stages.value.push(newStage);

      // Добавляем сцену в главу
      if (stage.chapterId) {
        const chapterIndex = chapters.value.findIndex(c => c.id === stage.chapterId);
        if (chapterIndex !== -1) {
          chapters.value[chapterIndex].stageIds.push(newStage.id);
          saveChapters();
        }
      }

      saveStages();
      return newStage;
    };

    const updateStage = (stageId: StageID, updates: Partial<Stage>) => {
      const index = stages.value.findIndex(stage => stage.id === stageId);
      if (index !== -1) {
        // Если меняется глава, нужно обновить ссылки
        if (updates.chapterId && updates.chapterId !== stages.value[index].chapterId) {
          // Удаляем из старой главы
          const oldChapterId = stages.value[index].chapterId;
          if (oldChapterId) {
            const oldChapterIndex = chapters.value.findIndex(c => c.id === oldChapterId);
            if (oldChapterIndex !== -1) {
              chapters.value[oldChapterIndex].stageIds =
                chapters.value[oldChapterIndex].stageIds.filter(id => id !== stageId);
            }
          }

          // Добавляем в новую главу
          const newChapterIndex = chapters.value.findIndex(c => c.id === updates.chapterId);
          if (newChapterIndex !== -1) {
            chapters.value[newChapterIndex].stageIds.push(stageId);
          }

          saveChapters();
        }

        stages.value[index] = { ...stages.value[index], ...updates };
        saveStages();
        return true;
      }
      return false;
    };

    const deleteStage = (stageId: StageID) => {
      const index = stages.value.findIndex(stage => stage.id === stageId);
      if (index !== -1) {
        const chapterId = stages.value[index].chapterId;

        // Удаляем сцену из главы
        if (chapterId) {
          const chapterIndex = chapters.value.findIndex(c => c.id === chapterId);
          if (chapterIndex !== -1) {
            chapters.value[chapterIndex].stageIds =
              chapters.value[chapterIndex].stageIds.filter(id => id !== stageId);
            saveChapters();
          }
        }

        stages.value.splice(index, 1);

        // Пересчитываем порядок сцен
        if (chapterId) {
          const chapterStages = stages.value.filter(s => s.chapterId === chapterId);
          chapterStages.forEach((stage, idx) => {
            stage.order = idx + 1;
          });
        }

        saveStages();
        return true;
      }
      return false;
    };

    // Функции для работы с текущей книгой
    const setCurrentBook = (bookId: string) => {
      currentBookId.value = bookId;
    };

    const getCurrentBook = computed(() => {
      if (!currentBookId.value) return null;
      return books.value.find(book => book.id === currentBookId.value) || null;
    });

    // Получение глав для текущей книги
    const getBookChapters = computed(() => {
      if (!currentBookId.value) return [];
      return chapters.value
        .filter(chapter => chapter.bookId === currentBookId.value)
        .sort((a, b) => a.order - b.order);
    });

    // Получение сцен для главы
    const getChapterStages = (chapterId: ChapterID) => {
      const chapter = chapters.value.find(c => c.id === chapterId);
      if (!chapter) return [];

      return stages.value
        .filter(stage => stage.chapterId === chapterId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    // Отслеживание изменений проекта
    watch(() => projectStore.currentProject?.path, () => {
      loadBooks();
      loadSeries();
      loadAuthors();
      loadChapters();
      loadStages();
    }, { immediate: true });

    // Наблюдение за изменениями
    watch(books, saveBooks, { deep: true });
    watch(series, saveSeries, { deep: true });
    watch(authors, saveAuthors, { deep: true });
    watch(chapters, saveChapters, { deep: true });
    watch(stages, saveStages, { deep: true });

    // Для currentChapterText мы сохраняем напрямую при изменении
    watch(
      currentChapterText,
      (newVal) => {
        if (newVal) {
          saveChapterText(newVal);
        }
      },
      { deep: true }
    );

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
      chapters,
      stages,
      currentChapterText,
      currentBookId,
      canAddBook,
      canAddSeries,
      canAddAuthor,
      loadBooks,
      loadSeries,
      loadAuthors,
      loadChapters,
      loadStages,
      loadChapterText,
      saveBooks,
      saveSeries,
      saveAuthors,
      saveChapters,
      saveStages,
      saveChapterText,
      addBook,
      addSeries,
      addAuthor,
      updateBook,
      updateSeries,
      updateAuthor,
      deleteBook,
      deleteSeries,
      deleteAuthor,
      addChapter,
      updateChapter,
      deleteChapter,
      addStage,
      updateStage,
      deleteStage,
      setCurrentBook,
      getCurrentBook,
      getBookChapters,
      getChapterStages,
      findBooksByAuthor,
      findBooksBySeries,
      findSeriesByAuthor,
    };
  }
);

export const useBookStore = defineStore(BOOK_STORE, () => {
  const privateStore = useBookPrivateStore();

  // Создаем вычисляемые свойства для обеспечения реактивности
  const books = computed(() => privateStore.books);
  const series = computed(() => privateStore.series);
  const authors = computed(() => privateStore.authors);
  const chapters = computed(() => privateStore.chapters);
  const stages = computed(() => privateStore.stages);
  const currentChapterText = computed(() => privateStore.currentChapterText);
  const currentBookId = computed(() => privateStore.currentBookId);
  const canAddBook = computed(() => privateStore.canAddBook);
  const canAddSeries = computed(() => privateStore.canAddSeries);
  const canAddAuthor = computed(() => privateStore.canAddAuthor);

  return {
    // Используем вычисляемые свойства вместо прямых ссылок
    books,
    series,
    authors,
    chapters,
    stages,
    currentChapterText,
    currentBookId,
    canAddBook,
    canAddSeries,
    canAddAuthor,
    loadBooks: privateStore.loadBooks,
    loadSeries: privateStore.loadSeries,
    loadAuthors: privateStore.loadAuthors,
    loadChapters: privateStore.loadChapters,
    loadStages: privateStore.loadStages,
    loadChapterText: privateStore.loadChapterText,
    saveBooks: privateStore.saveBooks,
    saveSeries: privateStore.saveSeries,
    saveAuthors: privateStore.saveAuthors,
    saveChapters: privateStore.saveChapters,
    saveStages: privateStore.saveStages,
    saveChapterText: privateStore.saveChapterText,
    addBook: privateStore.addBook,
    addSeries: privateStore.addSeries,
    addAuthor: privateStore.addAuthor,
    updateBook: privateStore.updateBook,
    updateSeries: privateStore.updateSeries,
    updateAuthor: privateStore.updateAuthor,
    deleteBook: privateStore.deleteBook,
    deleteSeries: privateStore.deleteSeries,
    deleteAuthor: privateStore.deleteAuthor,
    addChapter: privateStore.addChapter,
    updateChapter: privateStore.updateChapter,
    deleteChapter: privateStore.deleteChapter,
    addStage: privateStore.addStage,
    updateStage: privateStore.updateStage,
    deleteStage: privateStore.deleteStage,
    setCurrentBook: privateStore.setCurrentBook,
    getCurrentBook: privateStore.getCurrentBook,
    getBookChapters: privateStore.getBookChapters,
    getChapterStages: privateStore.getChapterStages,
    findBooksByAuthor: privateStore.findBooksByAuthor,
    findBooksBySeries: privateStore.findBooksBySeries,
    findSeriesByAuthor: privateStore.findSeriesByAuthor,
  };
});
