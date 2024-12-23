export interface IAuthor {
  firstName: string;
  middleName: string | null;
  lastName: string;
  titleName: string;
}

export type AuthorKeys = keyof IAuthor;
