import { Page } from '@/router.type';

export const BOOK_PAGE: Page = {
  path: '/book',
  name: 'book-page',
  title: 'Book',
} as const;

export const BOOK_NEW_PAGE: Page = {
  path: '/book/new',
  name: 'new-book-page',
  title: 'New Book',
} as const;

export const SERIES_NEW_PAGE = {
  path: '/book/series/new',
  name: 'series-new',
} as const;

export const BOOK_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const BOOK_GENRES = {
  FICTION: 'fiction', // вымышленные произведения
  NON_FICTION: 'non-fiction', // научно-популярные
  MYSTERY: 'mystery', // детективы
  FANTASY: 'fantasy', // фэнтези
  SCIENCE_FICTION: 'science fiction', // научная фантастика
  BIOGRAPHY: 'biography', // биографии
  HISTORY: 'history', // исторические
  HORROR: 'horror', // ужасы
  ROMANCE: 'romance', // романы
  THRILLER: 'thriller', // триллеры
  WESTERN: 'western', // вестерны
  ADVENTURE: 'adventure', // приключения
  ACTION: 'action', // боевики
  COMEDY: 'comedy', // комедии
  DRAMA: 'drama', // драмы
  POETRY: 'poetry', // поэзия
  PROSE: 'prose', // проза
  SUSPENSE: 'suspense', // детективы
  YOUNG_ADULT: 'young adult', // для подростков
  CHILDREN: 'children', // для детей
  EDUCATION: 'education', // для образования
  RELIGION: 'religion', // религиозные
  SCIENCE: 'science', // научно-популярные
  TECHNOLOGY: 'technology', // научно-популярные
  TRAVEL: 'travel', // путешествия
  OTHER: 'other', // другие
} as const;

export const SERIES_TYPES = {
  DILOGY: 'dilogy', // 2 книги
  TRILOGY: 'trilogy', // 3 книги
  TETRALOGY: 'tetralogy', // 4 книги
  PENTALOGY: 'pentalogy', // 5 книг
  HEXALOGY: 'hexalogy', // 6 книг
  HEPTALOGY: 'heptalogy', // 7 книг
  SERIES: 'series', // более 7 книг
} as const;

export const BOOK_RELATION_TYPES = {
  SEQUEL: 'sequel', // Продолжение
  PREQUEL: 'prequel', // Предыстория
  SPIN_OFF: 'spin-off', // Ответвление
  SIDE_STORY: 'side-story', // Побочная история
  ADAPTATION: 'adaptation', // Адаптация
  REMAKE: 'remake', // Переработка
  ALTERNATIVE: 'alternative', // Альтернативная версия
  OTHER: 'other', // Другое
} as const;
