// Брендированный тип для ID
export type ID<Brand extends string> = string & { readonly __brand: Brand };

// Типы для конкретных сущностей
export type BookID = ID<'Book'>;
export type AuthorID = ID<'Author'>;
export type SeriesID = ID<'Series'>;
export type ChapterID = ID<'Chapter'>;
export type SceneID = ID<'Scene'>;
export type CharacterID = ID<'Character'>;

// Функция для создания типизированного ID
export function createID<Brand extends string>(id: string): ID<Brand> {
  if (!isValidID(id)) {
    throw new Error('Неверный формат ID');
  }

  return id as ID<Brand>;
}

// Функция для проверки валидности ID
export function isValidID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return typeof id === 'string' && uuidRegex.test(id);
}
