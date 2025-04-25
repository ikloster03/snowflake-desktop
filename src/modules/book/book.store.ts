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
  STAGES: 'stages.json',
  BOOKS_DIR: 'books/', // Директория для книг
  CHAPTERS_JSON: 'chapters.json', // Внутри директории книги
  CHAPTER_TEXT_DIR: 'text/', // Директория для текста глав внутри директории книги
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

    // Проверка и дедупликация сущностей
    const checkAndEnsureUniqueIds = <T extends { id: string }>(items: T[]): T[] => {
      console.log(`Проверка уникальности ID для ${items.length} элементов`);

      // Создаем Map для быстрого поиска дубликатов
      const uniqueItems = new Map<string, T>();
      const duplicates: string[] = [];

      // Заполняем map, обнаруживая дубликаты
      items.forEach(item => {
        if (uniqueItems.has(item.id)) {
          duplicates.push(item.id);
        } else {
          uniqueItems.set(item.id, item);
        }
      });

      // Логируем информацию о найденных дубликатах
      if (duplicates.length > 0) {
        console.warn(`Обнаружены дубликаты ID: ${duplicates.join(', ')}`);
        console.warn(`Всего дубликатов: ${duplicates.length} из ${items.length} элементов`);
      }

      return Array.from(uniqueItems.values());
    };

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
        let loadedBooks: ISingleBook[] = JSON.parse(booksJson);

        // Проверяем и дедуплицируем книги
        const originalCount = loadedBooks.length;
        loadedBooks = checkAndEnsureUniqueIds(loadedBooks);
        if (originalCount !== loadedBooks.length) {
          console.warn(`BookStore: Удалено ${originalCount - loadedBooks.length} дубликатов книг`);
          // Пересохраняем файл без дубликатов
          await fs.writeTextFile(booksPath, JSON.stringify(loadedBooks, null, 2));
        }

        books.value = loadedBooks;
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
      console.log('BookStore: Загрузка всех глав');

      try {
        // Очищаем существующие главы
        chapters.value = [];

        // Базовый путь к директории с книгами
        const booksDir = `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS_DIR}`;
        const booksExists = await fs.exists(booksDir);

        if (!booksExists) {
          await fs.mkdir(booksDir, { recursive: true });
          return;
        }

        // Загружаем главы для каждой книги в массиве books
        for (const book of books.value) {
          const bookDir = `${booksDir}${book.id}/`;
          const bookDirExists = await fs.exists(bookDir);

          if (!bookDirExists) {
            await fs.mkdir(bookDir, { recursive: true });
            continue;
          }

          const chaptersPath = `${bookDir}${BOOK_DATA.CHAPTERS_JSON}`;
          const chaptersExists = await fs.exists(chaptersPath);

          if (!chaptersExists) {
            // Создаем пустой массив глав для книги
            await fs.writeTextFile(chaptersPath, JSON.stringify([], null, 2));
            continue;
          }

          try {
            const chaptersJson = await fs.readTextFile(chaptersPath);
            let bookChapters: Chapter[] = JSON.parse(chaptersJson);

            // Проверяем и дедуплицируем главы
            const originalCount = bookChapters.length;
            bookChapters = checkAndEnsureUniqueIds(bookChapters);
            if (originalCount !== bookChapters.length) {
              console.warn(`BookStore: Удалено ${originalCount - bookChapters.length} дубликатов глав для книги ${book.id}`);
              // Пересохраняем файл без дубликатов
              await fs.writeTextFile(chaptersPath, JSON.stringify(bookChapters, null, 2));
            }

            console.log(`BookStore: Загружено ${bookChapters.length} глав для книги ${book.id}`);
            chapters.value.push(...bookChapters);
          } catch (e) {
            console.error(`Ошибка загрузки глав из ${chaptersPath}:`, e);
          }
        }

        // Проверяем на дублирование ID глав в общем списке
        const originalCount = chapters.value.length;
        chapters.value = checkAndEnsureUniqueIds(chapters.value);
        if (originalCount !== chapters.value.length) {
          console.warn(`BookStore: Удалено ${originalCount - chapters.value.length} дубликатов глав в общем списке`);
        }

        console.log(`BookStore: Всего загружено ${chapters.value.length} глав`);
      } catch (error) {
        console.error('Ошибка загрузки глав:', error);
      }
    };

    // Загрузка глав конкретной книги
    const loadBookChapters = async (bookId: string) => {
      if (!projectStore.currentProject?.path) return [];
      console.log(`BookStore: Загрузка глав для книги ${bookId}`);

      try {
        const bookDir = `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS_DIR}${bookId}/`;
        const bookDirExists = await fs.exists(bookDir);

        if (!bookDirExists) {
          await fs.mkdir(bookDir, { recursive: true });
          return [];
        }

        const chaptersPath = `${bookDir}${BOOK_DATA.CHAPTERS_JSON}`;
        const chaptersExists = await fs.exists(chaptersPath);

        if (!chaptersExists) {
          await fs.writeTextFile(chaptersPath, JSON.stringify([], null, 2));
          return [];
        }

        const chaptersJson = await fs.readTextFile(chaptersPath);
        let bookChapters: Chapter[] = JSON.parse(chaptersJson);

        // Проверяем и дедуплицируем главы
        const originalCount = bookChapters.length;
        bookChapters = checkAndEnsureUniqueIds(bookChapters);
        if (originalCount !== bookChapters.length) {
          console.warn(`BookStore: Удалено ${originalCount - bookChapters.length} дубликатов глав для книги ${bookId}`);
          // Пересохраняем файл без дубликатов
          await fs.writeTextFile(chaptersPath, JSON.stringify(bookChapters, null, 2));
        }

        // Фильтруем существующие главы для текущей книги, сохраняя остальные
        const otherChapters = chapters.value.filter(c => c.bookId !== bookId);

        // Объединяем с главами других книг
        chapters.value = [...otherChapters, ...bookChapters];

        // Проверяем на дублирование ID глав в общем списке
        const totalOriginalCount = chapters.value.length;
        chapters.value = checkAndEnsureUniqueIds(chapters.value);
        if (totalOriginalCount !== chapters.value.length) {
          console.warn(`BookStore: Удалено ${totalOriginalCount - chapters.value.length} дубликатов глав в общем списке`);
        }

        console.log(`BookStore: Загружено ${bookChapters.length} глав для книги ${bookId}`);
        return bookChapters;
      } catch (error) {
        console.error(`Ошибка загрузки глав для книги ${bookId}:`, error);
        return [];
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
        let loadedStages: Stage[] = JSON.parse(stagesJson);

        // Проверяем и дедуплицируем сцены
        const originalCount = loadedStages.length;
        loadedStages = checkAndEnsureUniqueIds(loadedStages);
        if (originalCount !== loadedStages.length) {
          console.warn(`BookStore: Удалено ${originalCount - loadedStages.length} дубликатов сцен`);
          // Пересохраняем файл без дубликатов
          await fs.writeTextFile(stagesPath, JSON.stringify(loadedStages, null, 2));
        }

        stages.value = loadedStages;
      } catch (error) {
        console.error('Error loading stages:', error);
      }
    };

    // Загрузка текста главы
    const loadChapterText = async (chapterId: ChapterID) => {
      if (!projectStore.currentProject?.path) return null;

      try {
        console.log(`BookStore: Начало загрузки текста главы ${chapterId}`);

        // Проверяем, не загружен ли уже текст этой главы и не пустой ли он
        if (currentChapterText.value &&
            currentChapterText.value.id === chapterId &&
            currentChapterText.value.content.length > 0) {
          console.log(`BookStore: Текст главы ${chapterId} уже загружен в памяти, используем кэшированную версию. Длина текста: ${currentChapterText.value.content.length}`);
          return currentChapterText.value;
        }

        // Сначала находим главу, чтобы узнать её bookId
        const chapter = chapters.value.find(c => c.id === chapterId);
        if (!chapter) {
          console.error(`BookStore: Ошибка загрузки текста главы: глава ${chapterId} не найдена`);
          return null;
        }

        const bookId = chapter.bookId;
        const bookDir = `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS_DIR}${bookId}/`;
        const textDir = `${bookDir}${BOOK_DATA.CHAPTER_TEXT_DIR}`;

        // Создаем директорию для текстов глав, если её нет
        const textDirExists = await fs.exists(textDir);
        if (!textDirExists) {
          console.log(`BookStore: Создаем директорию для текстов глав: ${textDir}`);
          await fs.mkdir(textDir, { recursive: true });
        }

        const chapterTextPath = `${textDir}${chapterId}.txt`;
        console.log(`BookStore: Проверяем существование файла текста главы: ${chapterTextPath}`);
        const exists = await fs.exists(chapterTextPath);

        // Проверяем, есть ли уже текст в памяти перед созданием нового файла
        if (!exists) {
          // Если файла нет, создаем пустой
          console.log(`BookStore: Файл текста главы не существует, создаем пустой`);
          await fs.writeTextFile(chapterTextPath, '');

          // Только если нет текста в памяти, создаем новый объект
          if (!currentChapterText.value || currentChapterText.value.id !== chapterId) {
            currentChapterText.value = {
              id: chapterId,
              content: '',
              lastModified: new Date()
            };
          }

          console.log(`BookStore: Создан пустой текст для главы ${chapterId}`);
          return currentChapterText.value;
        }

        console.log(`BookStore: Читаем содержимое файла текста главы ${chapterId}`);
        const content = await fs.readTextFile(chapterTextPath);
        console.log(`BookStore: Прочитан текст главы ${chapterId}, длина: ${content.length}`);

        // Проверяем - если текущий текст в памяти длиннее, то используем его
        if (currentChapterText.value &&
            currentChapterText.value.id === chapterId &&
            currentChapterText.value.content.length > content.length) {
          console.warn(`BookStore: Текст главы ${chapterId} в памяти (${currentChapterText.value.content.length} символов) длиннее, чем в файле (${content.length} символов). Используем версию из памяти.`);

          // Сохраняем текст из памяти обратно в файл
          await fs.writeTextFile(chapterTextPath, currentChapterText.value.content);
          console.log(`BookStore: Сохранен текст из памяти для главы ${chapterId}`);

          return currentChapterText.value;
        }

        // Если в файле есть содержимое, используем его
        if (content.length > 0) {
          currentChapterText.value = {
            id: chapterId,
            content,
            lastModified: new Date()
          };
        } else if (!currentChapterText.value || currentChapterText.value.id !== chapterId) {
          // Если файл пустой и нет текущего текста в памяти
          currentChapterText.value = {
            id: chapterId,
            content: '',
            lastModified: new Date()
          };
        }

        return currentChapterText.value;
      } catch (error) {
        console.error('BookStore: Ошибка загрузки текста главы:', error);
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

    // Сохранение глав
    const saveChapters = async () => {
      if (!projectStore.currentProject?.path) return;
      console.log('BookStore: Сохранение глав');

      try {
        // Дедупликация глав перед сохранением
        const originalCount = chapters.value.length;
        chapters.value = checkAndEnsureUniqueIds(chapters.value);
        if (originalCount !== chapters.value.length) {
          console.warn(`BookStore: Удалено ${originalCount - chapters.value.length} дубликатов глав перед сохранением`);
        }

        // Базовый путь к директории с книгами
        const booksDir = `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS_DIR}`;
        const booksExists = await fs.exists(booksDir);

        if (!booksExists) {
          await fs.mkdir(booksDir, { recursive: true });
        }

        // Группируем главы по книгам
        const chaptersByBook = new Map<string, Chapter[]>();

        for (const chapter of chapters.value) {
          if (!chaptersByBook.has(chapter.bookId)) {
            chaptersByBook.set(chapter.bookId, []);
          }
          chaptersByBook.get(chapter.bookId)!.push(chapter);
        }

        // Сохраняем главы для каждой книги в отдельный файл
        for (const [bookId, bookChapters] of chaptersByBook.entries()) {
          const bookDir = `${booksDir}${bookId}/`;
          const bookDirExists = await fs.exists(bookDir);

          if (!bookDirExists) {
            await fs.mkdir(bookDir, { recursive: true });
          }

          // Дедупликация глав для конкретной книги
          const uniqueBookChapters = checkAndEnsureUniqueIds(bookChapters);

          const chaptersPath = `${bookDir}${BOOK_DATA.CHAPTERS_JSON}`;
          await fs.writeTextFile(chaptersPath, JSON.stringify(uniqueBookChapters, null, 2));
          console.log(`BookStore: Сохранено ${uniqueBookChapters.length} глав для книги ${bookId}`);
        }
      } catch (error) {
        console.error('Ошибка сохранения глав:', error);
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

    // Сохранение текста главы с дополнительной защитой от потери данных
    const saveChapterText = async (chapterText: ChapterText) => {
      if (!projectStore.currentProject?.path) return;

      try {
        // Сначала проверяем, не пустое ли содержимое главы
        if (chapterText.content.length === 0) {
          console.warn(`BookStore: Попытка сохранить пустой текст для главы ${chapterText.id}`);

          // Проверяем, есть ли текст в памяти
          if (currentChapterText.value &&
              currentChapterText.value.id === chapterText.id &&
              currentChapterText.value.content.length > 0) {
            console.warn(`BookStore: Предотвращено сохранение пустого текста для главы ${chapterText.id}, используем существующий текст длиной ${currentChapterText.value.content.length}`);
            return;
          }
        }

        // Находим главу, чтобы узнать её bookId
        const chapter = chapters.value.find(c => c.id === chapterText.id);
        if (!chapter) {
          console.error(`Ошибка сохранения текста главы: глава ${chapterText.id} не найдена`);
          return;
        }

        const bookId = chapter.bookId;
        const bookDir = `${projectStore.currentProject.path}/${BOOK_DATA.BOOKS_DIR}${bookId}/`;

        // Проверяем существование директории книги
        const bookDirExists = await fs.exists(bookDir);
        if (!bookDirExists) {
          await fs.mkdir(bookDir, { recursive: true });
        }

        // Директория для текстов глав
        const textDir = `${bookDir}${BOOK_DATA.CHAPTER_TEXT_DIR}`;
        const textDirExists = await fs.exists(textDir);
        if (!textDirExists) {
          await fs.mkdir(textDir, { recursive: true });
        }

        const chapterTextPath = `${textDir}${chapterText.id}.txt`;

        // Дополнительная проверка - проверяем существующий файл
        const fileExists = await fs.exists(chapterTextPath);
        if (fileExists) {
          const existingContent = await fs.readTextFile(chapterTextPath);

          // Если существующий файл имеет контент, а новый - пустой, предотвращаем затирание
          if (existingContent.length > 0 && chapterText.content.length === 0) {
            console.warn(`BookStore: Предотвращена перезапись файла с контентом (${existingContent.length} символов) пустым текстом для главы ${chapterText.id}`);

            // Обновляем текст в памяти существующим из файла
            currentChapterText.value = {
              id: chapterText.id,
              content: existingContent,
              lastModified: new Date()
            };

            return;
          }

          // Вывод отладочной информации
          console.log(`Сохранение текста главы ${chapterText.id}:`, {
            content: chapterText.content.substring(0, 50) + (chapterText.content.length > 50 ? '...' : ''),
            path: chapterTextPath,
            length: chapterText.content.length
          });

          // Создаем резервную копию перед сохранением
          const backupPath = `${textDir}${chapterText.id}.backup.txt`;
          await fs.writeTextFile(backupPath, existingContent);
          console.log(`BookStore: Создана резервная копия текста главы ${chapterText.id}`);
        } else {
          // Вывод отладочной информации
          console.log(`Сохранение текста главы ${chapterText.id}:`, {
            content: chapterText.content.substring(0, 50) + (chapterText.content.length > 50 ? '...' : ''),
            path: chapterTextPath,
            length: chapterText.content.length
          });
        }

        // Сохраняем текст главы
        await fs.writeTextFile(chapterTextPath, chapterText.content);

        // Обновляем данные в памяти
        currentChapterText.value = {
          ...chapterText,
          lastModified: new Date()
        };

        console.log(`BookStore: Текст главы ${chapterText.id} успешно сохранен, длина: ${chapterText.content.length}`);
      } catch (error) {
        console.error('Ошибка сохранения текста главы:', error);
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
      console.log(`BookStore: установка currentBookId с ${currentBookId.value} на ${bookId}`);
      currentBookId.value = bookId;
    };

    const getCurrentBook = computed(() => {
      if (!currentBookId.value) return null;
      return books.value.find(book => book.id === currentBookId.value) || null;
    });

    // Получение глав для текущей книги
    const getBookChapters = computed(() => {
      const bookId = currentBookId.value;
      console.log(`BookStore: вычисление getBookChapters для книги ${bookId || 'не выбрана'}`);

      if (!bookId) {
        return [];
      }

      const bookChapters = chapters.value
        .filter(chapter => chapter.bookId === bookId)
        .sort((a, b) => a.order - b.order);

      console.log(`BookStore: найдено ${bookChapters.length} глав для книги ${bookId}`);
      return bookChapters;
    });

    // Получение сцен для главы
    const getChapterStages = (chapterId: ChapterID) => {
      const chapter = chapters.value.find(c => c.id === chapterId);
      if (!chapter) return [];

      return stages.value
        .filter(stage => stage.chapterId === chapterId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    // Наблюдение за изменением текущей книги
    watch(currentBookId, async (newBookId, oldBookId) => {
      console.log(`BookStore: currentBookId изменился с '${oldBookId}' на '${newBookId}'`);
      if (newBookId && newBookId !== oldBookId) {
        // Загружаем главы для новой книги
        await loadBookChapters(newBookId);
      }
    });

    // Отслеживание изменений проекта
    watch(() => projectStore.currentProject?.path, async () => {
      console.log('BookStore: Изменился путь проекта, загружаем данные');
      await loadBooks();
      await loadSeries();
      await loadAuthors();
      await loadChapters();
      await loadStages();
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
      // Вычисляемые свойства
      authors,
      books,
      canAddAuthor,
      canAddBook,
      canAddSeries,
      chapters,
      currentBookId,
      currentChapterText,
      series,
      stages,
      getBookChapters,
      getCurrentBook,

      // Функции
      addAuthor,
      addBook,
      addChapter,
      addSeries,
      addStage,
      deleteAuthor,
      deleteBook,
      deleteChapter,
      deleteSeries,
      deleteStage,
      findBooksByAuthor,
      findBooksBySeries,
      findSeriesByAuthor,
      getChapterStages,
      loadAuthors,
      loadBooks,
      loadChapters,
      loadChapterText,
      loadSeries,
      loadStages,
      saveAuthors,
      saveBooks,
      saveChapters,
      saveChapterText,
      saveSeries,
      saveStages,
      setCurrentBook,
      updateAuthor,
      updateBook,
      updateChapter,
      updateSeries,
      updateStage,
      loadBookChapters,
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
    // Вычисляемые свойства
    authors,
    books,
    canAddAuthor,
    canAddBook,
    canAddSeries,
    chapters,
    currentBookId,
    currentChapterText,
    series,
    stages,
    getBookChapters: privateStore.getBookChapters,
    getCurrentBook: privateStore.getCurrentBook,

    // Функции
    addAuthor: privateStore.addAuthor,
    addBook: privateStore.addBook,
    addChapter: privateStore.addChapter,
    addSeries: privateStore.addSeries,
    addStage: privateStore.addStage,
    deleteAuthor: privateStore.deleteAuthor,
    deleteBook: privateStore.deleteBook,
    deleteChapter: privateStore.deleteChapter,
    deleteSeries: privateStore.deleteSeries,
    deleteStage: privateStore.deleteStage,
    findBooksByAuthor: privateStore.findBooksByAuthor,
    findBooksBySeries: privateStore.findBooksBySeries,
    findSeriesByAuthor: privateStore.findSeriesByAuthor,
    getChapterStages: privateStore.getChapterStages,
    loadAuthors: privateStore.loadAuthors,
    loadBooks: privateStore.loadBooks,
    loadChapterText: privateStore.loadChapterText,
    loadChapters: privateStore.loadChapters,
    loadSeries: privateStore.loadSeries,
    loadStages: privateStore.loadStages,
    saveAuthors: privateStore.saveAuthors,
    saveBooks: privateStore.saveBooks,
    saveChapterText: privateStore.saveChapterText,
    saveChapters: privateStore.saveChapters,
    saveSeries: privateStore.saveSeries,
    saveStages: privateStore.saveStages,
    setCurrentBook: privateStore.setCurrentBook,
    updateAuthor: privateStore.updateAuthor,
    updateBook: privateStore.updateBook,
    updateChapter: privateStore.updateChapter,
    updateSeries: privateStore.updateSeries,
    updateStage: privateStore.updateStage,
    loadBookChapters: privateStore.loadBookChapters,
  };
});
