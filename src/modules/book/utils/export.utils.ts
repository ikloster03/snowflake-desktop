import { ISingleBook, ChapterText } from '../book.types';
import { writeFile } from '@tauri-apps/plugin-fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Очищает HTML-контент от тегов, оставляя только текст
 */
export function stripHtmlTags(html: string): string {
  // Создаем временный элемент для парсинга HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Заменяем блочные элементы на переносы строк
  const blockElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, blockquote, li, br');
  blockElements.forEach(element => {
    if (element.tagName === 'BR') {
      element.replaceWith('\n');
    } else {
      element.insertAdjacentText('afterend', '\n');
    }
  });

  // Заменяем списки на структурированный текст
  const lists = tempDiv.querySelectorAll('ul, ol');
  lists.forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach((item, index) => {
      const prefix = list.tagName === 'UL' ? '• ' : `${index + 1}. `;
      item.insertAdjacentText('beforebegin', prefix);
    });
  });

  // Обрабатываем блоки сцен
  const stageBlocks = tempDiv.querySelectorAll('.stage-block');
  stageBlocks.forEach(block => {
    const stageHeader = block.querySelector('.stage-header');
    const stageContent = block.querySelector('.stage-content');

    if (stageHeader && stageContent) {
      const stageTitle = stageHeader.textContent?.trim() || 'Сцена';
      block.innerHTML = `\n\n=== ${stageTitle} ===\n\n${stageContent.innerHTML}\n\n`;
    }
  });

  // Получаем только текстовое содержимое
  let textContent = tempDiv.textContent || tempDiv.innerText || '';

  // Очищаем лишние пробелы и переносы
  textContent = textContent
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Убираем множественные переносы
    .replace(/[ \t]+/g, ' ') // Убираем лишние пробелы
    .trim();

  return textContent;
}

/**
 * Экспортирует книгу в указанную директорию в формате DOCX
 */
export async function exportBookToWord(book: ISingleBook, selectedDirectory: string, chaptersText?: ChapterText[]): Promise<void> {
  try {
    // Создаем массив параграфов для документа
    const paragraphs: Paragraph[] = [];

    // Добавляем заголовок книги
    paragraphs.push(
      new Paragraph({
        text: book.title,
        heading: HeadingLevel.TITLE,
        spacing: {
          after: 400,
        },
      })
    );

    // Добавляем информацию о книге
    if (book.description) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Описание: ',
              bold: true,
            }),
            new TextRun({
              text: book.description,
            }),
          ],
          spacing: {
            after: 200,
          },
        })
      );
    }

    if (book.genres && book.genres.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Жанры: ',
              bold: true,
            }),
            new TextRun({
              text: book.genres.join(', '),
            }),
          ],
          spacing: {
            after: 400,
          },
        })
      );
    }

    // Добавляем содержимое глав
    if (book.chapters && book.chapters.length > 0 && chaptersText) {
      // Заголовок содержания
      paragraphs.push(
        new Paragraph({
          text: 'СОДЕРЖАНИЕ',
          heading: HeadingLevel.HEADING_1,
          spacing: {
            before: 400,
            after: 200,
          },
        })
      );

      book.chapters.forEach((chapter, index) => {
        // Заголовок главы
        paragraphs.push(
          new Paragraph({
            text: `Глава ${index + 1}: ${chapter.title}`,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          })
        );

        // Ищем текст главы
        const chapterText = chaptersText.find(ct => ct.id === chapter.id);
        if (chapterText && chapterText.content) {
          const cleanContent = stripHtmlTags(chapterText.content);

          // Разбиваем текст на параграфы
          const textParagraphs = cleanContent.split('\n\n').filter(p => p.trim());

          textParagraphs.forEach(paragraph => {
            paragraphs.push(
              new Paragraph({
                text: paragraph.trim(),
                spacing: {
                  after: 200,
                },
              })
            );
          });
        }
      });
    }

    // Создаем документ
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Генерируем blob документа (совместимо с браузерной средой)
    const blob = await Packer.toBlob(doc);

    // Конвертируем blob в ArrayBuffer, а затем в Uint8Array
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Создаем имя файла
    const fileName = `${book.title}.docx`;
    const filePath = `${selectedDirectory}/${fileName}`;

    // Сохраняем файл через writeFile (для бинарных данных)
    await writeFile(filePath, uint8Array);

    console.log(`Книга "${book.title}" успешно экспортирована в DOCX по пути: ${filePath}`);
  } catch (error) {
    console.error('Ошибка при экспорте книги в DOCX:', error);
    throw new Error('Не удалось экспортировать книгу в DOCX');
  }
}

/**
 * Проверяет, можно ли экспортировать книгу
 */
export function canExportBook(book: ISingleBook, chaptersText?: ChapterText[]): boolean {
  return !!(book.chapters && book.chapters.length > 0 && chaptersText && chaptersText.length > 0);
}
