import { describe, expect, it } from 'vitest';
import { createID, isValidID, BookID, AuthorID } from './id';

describe('ID utilities', () => {
  describe('isValidID', () => {
    it('должен возвращать true для корректного UUID v4', () => {
      const validUUIDs = [
        '123e4567-e89b-42d3-a456-556642440000',
        'c73bcdcc-2669-4bf6-81d3-e4ae73fb11fd',
        '47183823-2574-4bfd-b411-99ed177d3e43',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidID(uuid)).toBe(true);
      });
    });

    it.each([
      '',                                         // пустая строка
      'not-a-uuid',                               // неверный формат
        '123e4567-e89b-12d3-a456-55664244000',    // неполный UUID
        '123e4567-e89b-12d3-a456-5566424400000',  // слишком длинный UUID
        '123e4567-e89b-42d3-x456-556642440000',   // неверные символы
        null,                                     // null
        undefined,                                // undefined
    ])('должен возвращать false для некорректного UUID %s', (uuid) => {
      expect(isValidID(uuid as string)).toBe(false);
    });
  });

  describe('createID', () => {
    it('должен создавать типизированный ID из корректного UUID', () => {
      const validUUID = '123e4567-e89b-42d3-a456-556642440000';
      const bookId = createID<'Book'>(validUUID);
      expect(bookId).toBe(validUUID);
    });

    it('должен создавать типизированный ID при отсутствии аргумента, undefined или null с помощью uuid v4', () => {
      const bookId = createID<'Book'>();
      expect(bookId).toBeDefined();
      expect(isValidID(bookId)).toBe(true);
    });

    it('должен выбрасывать ошибку при попытке создать ID из некорректного UUID', () => {
      const invalidUUID = 'not-a-uuid';
      expect(() => createID<'Book'>(invalidUUID)).toThrow('Неверный формат ID');
    });

    it('должен корректно работать с типизацией', () => {
      const validUUID = '123e4567-e89b-42d3-a456-556642440000';
      const bookId: BookID = createID<'Book'>(validUUID);
      expect(bookId).toBe(validUUID);
    });

    it('должен корректно типизировать различные типы ID', () => {
      const uuid = '123e4567-e89b-42d3-a456-556642440000';

      const bookId = createID<'Book'>(uuid);
      const authorId = createID<'Author'>(uuid);

      // TypeScript проверка типов
      type AssertBookID = typeof bookId extends BookID ? true : false;
      type AssertAuthorID = typeof authorId extends AuthorID ? true : false;

      // Проверка во время выполнения
      expect(isValidID(bookId)).toBe(true);
      expect(isValidID(authorId)).toBe(true);

      // @ts-expect-error - нельзя присвоить AuthorID к BookID
      const invalidAssignment: BookID = authorId;

      // @ts-expect-error - нельзя присвоить BookID к AuthorID
      const anotherInvalidAssignment: AuthorID = bookId;
    });
  });
});
