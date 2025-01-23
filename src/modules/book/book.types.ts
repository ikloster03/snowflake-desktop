import { ValueOf } from "@/core";
import { ISBN } from "@/core/isbn";

export interface IAuthor {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  titleName: string;
}

export const BOOK_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const;

export type BookStatus = ValueOf<typeof BOOK_STATUS>;

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

export type BookGenre = ValueOf<typeof BOOK_GENRES>;

export interface ISingleBook {
  id: string;
  title: string;
  description: string;
  authors: IAuthor[];
  publicationDate: string;
  pages: number;
  isbn?: ISBN; // Изменено на тип ISBN
  genres: BookGenre[];
  status: BookStatus;
}

export interface IBookInSeries extends ISingleBook {
  seriesId: string;
  orderInSeries: number;
}

export interface IBookSeries {
  id: string;
  title: string;
  description: string;
  authors: IAuthor[];
  books: IBookInSeries[];
}

export type Book = ISingleBook | IBookInSeries;
