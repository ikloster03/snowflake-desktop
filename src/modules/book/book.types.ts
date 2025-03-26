import { ValueOf } from "@/core";
import { ISBN } from "@/core/isbn";
import { BOOK_STATUS, BOOK_GENRES, SERIES_TYPES, BOOK_RELATION_TYPES } from './book.const';
import { AuthorID, BookID, SeriesID, ChapterID, StageID } from "@/core/id";

export interface IAuthor {
  id: AuthorID;
  firstName: string;
  middleName: string | null;
  lastName: string;
  titleName: string;
}

export type BookStatus = ValueOf<typeof BOOK_STATUS>;
export type BookGenre = ValueOf<typeof BOOK_GENRES>;
export type SeriesType = ValueOf<typeof SERIES_TYPES>;
export type BookRelationType = ValueOf<typeof BOOK_RELATION_TYPES>;

export interface IBookRelation {
  sourceBookId: BookID; // ID исходной книги
  targetBookId: BookID; // ID связанной книги
  type: BookRelationType; // Тип связи
}

export interface ISingleBook {
  id: BookID;
  title: string;
  description: string;
  authors: IAuthor[];
  publicationDate: string;
  isbn?: ISBN;
  genres: BookGenre[];
  status: BookStatus;
  relations?: IBookRelation[];
  chapters?: Chapter[]; // Добавляем главы к книге
}

export interface IBookInSeries extends ISingleBook {
  seriesId: SeriesID;
  orderInSeries: number;
}

export interface IBookSeries {
  id: SeriesID;
  title: string;
  description: string;
  authors: IAuthor[];
  books: IBookInSeries[];
  type: SeriesType;
}

export type Book = ISingleBook | IBookInSeries;

// Новые интерфейсы для плана книги

export interface Stage {
  id: StageID;
  title: string;
  description?: string;
  chapterId?: ChapterID;
  characterIds: string[];
  eventIds: string[]; // События, происходящие в сцене
  locationIds: string[]; // Локации, где происходит сцена
  itemIds?: string[]; // Предметы, которые используются в сцене
  status?: string;
  order?: number;
  seriesId?: SeriesID; // ID серии, к которой относится сцена
}

export interface Chapter {
  id: ChapterID;
  title: string;
  description?: string;
  bookId: BookID;  // Связь с книгой
  stageIds: StageID[];  // Связь со сценами
  order: number;  // Порядок главы в книге
}

export interface ChapterText {
  id: ChapterID;  // Совпадает с id главы
  content: string;  // Текст главы
  lastModified: Date;  // Дата последнего редактирования
}
