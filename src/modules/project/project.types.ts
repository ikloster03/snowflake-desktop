import { IAuthor, Book, IBookSeries } from '../book/book.types';

export interface IProject {
  id: string;
  name: string;
  description: string;
  path: string; // путь к папке проекта
  created: string;
  updated: string;
  authors: IAuthor[];
  books: Book[];
  series: IBookSeries[];
}

export interface IProjectMeta {
  id: string;
  name: string;
  description: string;
  path: string;
  created: string;
  updated: string;
}
