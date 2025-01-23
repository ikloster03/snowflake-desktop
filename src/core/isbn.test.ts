import { describe, it, expect } from 'vitest';
import { createISBN, isISBN } from './isbn';

describe('ISBN Validation', () => {
    it('should create a valid ISBN-10', () => {
        const isbn10 = '0-306-40615-2';
        const result = createISBN(isbn10);
        expect(result).toBe(isbn10);
    });

    it('should create a valid ISBN-13', () => {
        const isbn13 = '978-3-16-148410-0';
        const result = createISBN(isbn13);
        expect(result).toBe(isbn13);
    });

    it('should throw an error for invalid ISBN', () => {
        const invalidISBN = '12345';
        expect(() => createISBN(invalidISBN)).toThrow('Неверный формат ISBN');
    });

    it('should identify a correct ISBN-10', () => {
        const isbn10 = '0-306-40615-2';
        expect(isISBN(isbn10)).toBe(true);
    });

    it('should identify a correct ISBN-13', () => {
        const isbn13 = '978-3-16-148410-0';
        expect(isISBN(isbn13)).toBe(true);
    });

    it('should identify an incorrect ISBN-10', () => {
        const invalidISBN10 = '0-306-40615-X'; // Неверная контрольная цифра
        expect(isISBN(invalidISBN10)).toBe(false);
    });

    it('should identify an incorrect ISBN-13', () => {
        const invalidISBN13 = '978-3-16-148410-1'; // Неверная контрольная цифра
        expect(isISBN(invalidISBN13)).toBe(false);
    });

    it('should identify a valid ISBN', () => {
        const validISBN = '978-3-16-148410-0';
        expect(isISBN(validISBN)).toBe(true);
    });

    it('should identify an invalid ISBN', () => {
        const invalidISBN = '12345';
        expect(isISBN(invalidISBN)).toBe(false);
    });
});
