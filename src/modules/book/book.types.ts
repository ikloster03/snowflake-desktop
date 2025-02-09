import { ValueOf } from "@/core";
import { ISBN } from "@/core/isbn";
import { BOOK_STATUS, BOOK_GENRES, SERIES_TYPES, BOOK_RELATION_TYPES } from './book.const';
import { AuthorID } from "@/core/id";
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
  sourceBookId: string; // ID исходной книги
  targetBookId: string; // ID связанной книги
  type: BookRelationType; // Тип связи
}

export interface ISingleBook {
  id: string;
  title: string;
  description: string;
  authors: IAuthor[];
  publicationDate: string;
  pages: number;
  isbn?: ISBN;
  genres: BookGenre[];
  status: BookStatus;
  relations?: IBookRelation[]; // Добавляем связи с другими книгами
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
  type: SeriesType;
}

export type Book = ISingleBook | IBookInSeries;
