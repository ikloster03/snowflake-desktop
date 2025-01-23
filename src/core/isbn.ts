// Брендированные типы для ISBN
declare const ISBNBrand: unique symbol;

// Тип ISBN, который гарантирует, что строка является валидным ISBN
export type ISBN = string & { readonly [ISBNBrand]: 'ISBN' };

// Функция для безопасного создания ISBN
export function createISBN(isbn: string): ISBN | null {
    // Проверяем, является ли переданная строка валидным ISBN
    if (validateISBN(isbn)) {
        // Если валидно, возвращаем как тип ISBN
        return isbn as ISBN;
    }

    throw new Error('Неверный формат ISBN');
}

// Функция для проверки валидности ISBN
function validateISBN(isbn: string): boolean {
    // Удаляем все символы, кроме цифр и 'X'
    const cleaned = isbn.replace(/[^0-9X]/gi, '');

    // Проверяем длину и выбираем соответствующую функцию проверки
    if (cleaned.length === 10) {
        return isValidISBN10(cleaned); // Проверка для ISBN-10
    } else if (cleaned.length === 13) {
        return isValidISBN13(cleaned); // Проверка для ISBN-13
    } else {
        return false; // Неверная длина
    }
}

// Функция для проверки валидности ISBN-10
function isValidISBN10(isbn: string): boolean {
    let sum = 0;
    // Считаем сумму, умножая каждую цифру на её позицию
    for (let i = 0; i < 9; i++) {
        const digit = parseInt(isbn[i], 10);
        sum += digit * (i + 1);
    }

    // Контрольная цифра
    const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9], 10);
    sum += checkDigit * 10;

    // Проверяем, делится ли сумма на 11
    return sum % 11 === 0;
}

// Функция для проверки валидности ISBN-13
function isValidISBN13(isbn: string): boolean {
    let sum = 0;
    // Считаем сумму, используя веса 1 и 3 для каждой цифры
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(isbn[i], 10);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }

    // Контрольная цифра
    const checkDigit = (10 - (sum % 10)) % 10;

    // Проверяем, совпадает ли контрольная цифра с последней цифрой
    return checkDigit === parseInt(isbn[12], 10);
}

// Type guard для проверки, является ли значение валидным ISBN
export function isISBN(value: unknown): value is ISBN {
    return typeof value === 'string' && validateISBN(value);
}

// Экспортируем функцию валидации для использования в других модулях
export { validateISBN };

