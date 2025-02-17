export const PROJECT_LIMITS = {
  // Ограничения для книг
  BOOKS: {
    MAX_BOOKS_PER_PROJECT: 250, // максимальное количество книг в проекте
    MAX_SERIES_PER_PROJECT: 5, // максимальное количество серий
    MAX_BOOKS_PER_SERIES: 50, // максимальное количество книг в одной серии
    MAX_BOOK_TITLE_LENGTH: 200, // максимальная длина названия
    MAX_BOOK_DESCRIPTION_LENGTH: 5000, // максимальная длина описания
    MAX_BOOK_ANNOTATION_LENGTH: 1500, // максимальная длина аннотации
    MAX_BOOK_SYNOPSIS_LENGTH: 10000, // максимальная длина синопсиса
    MAX_GENRES_PER_BOOK: 5, // максимальное количество жанров для одной книги
    MAX_AUTHORS_PER_BOOK: 5, // максимальное количество авторов
    MAX_AUTHOR_NAME_LENGTH: 100, // максимальная длина имени автора
  },

  // Ограничения для персонажей
  CHARACTERS: {
    MAX_CHARACTERS_PER_PROJECT: 100, // максимальное количество персонажей
    MAX_CHARACTER_NAME_LENGTH: 100,
    MAX_CHARACTER_DESCRIPTION_LENGTH: 3000,
  },

  // Ограничения для локаций
  LOCATIONS: {
    MAX_LOCATIONS_PER_PROJECT: 100,
    MAX_LOCATION_NAME_LENGTH: 100,
    MAX_LOCATION_DESCRIPTION_LENGTH: 3000,
  },

  // Ограничения для предметов
  ITEMS: {
    MAX_ITEMS_PER_PROJECT: 100,
    MAX_ITEM_NAME_LENGTH: 100,
    MAX_ITEM_DESCRIPTION_LENGTH: 3000,
  },

  // Ограничения для событий и временной шкалы
  TIMELINE: {
    MAX_EVENTS_PER_PROJECT: 1000,
    MAX_EVENT_NAME_LENGTH: 200,
    MAX_EVENT_DESCRIPTION_LENGTH: 2000,
    MAX_PARALLEL_TIMELINES: 10,
  },

  // Ограничения для медиафайлов
  MEDIA: {
    MAX_FILES_PER_PROJECT: 500,
    MAX_FILE_SIZE_MB: 10, // максимальный размер одного файла в МБ
    TOTAL_MEDIA_SIZE_MB: 200, // общий размер всех медиафайлов
    ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
    MAX_IMAGE_RESOLUTION: 2048, // максимальное разрешение изображения в пикселях
  },

  // Ограничения для проекта в целом
  PROJECT: {
    MAX_PROJECT_SIZE_MB: 500, // максимальный размер проекта в МБ
    MAX_BACKUP_COUNT: 10, // максимальное количество резервных копий
    MAX_RECENT_PROJECTS: 15, // максимальное количество недавних проектов
    AUTO_SAVE_INTERVAL: 300000, // интервал автосохранения в миллисекундах (5 минут)
  },

  // Ограничения для производительности
  PERFORMANCE: {
    MAX_MEMORY_USAGE_MB: 500, // максимальное использование памяти
    MAX_ITEMS_PER_PAGE: 50, // максимальное количество элементов на странице
    DEBOUNCE_DELAY: 300, // задержка для debounce в миллисекундах
    THROTTLE_DELAY: 200, // задержка для throttle в миллисекундах
  }
} as const;
