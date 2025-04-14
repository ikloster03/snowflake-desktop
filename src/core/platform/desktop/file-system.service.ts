import { FileSystemService } from '../types';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

/**
 * Реализация FileSystemService для десктопной платформы, используя Tauri API
 */
export class DesktopFileSystemService implements FileSystemService {
  /**
   * Открыть диалог выбора файла
   * @param options Опции диалога
   */
  async openFileDialog(options?: {
    extensions?: string[];
  }): Promise<string | null> {
    try {
      const selected = await open({
        multiple: false,
        filters: options?.extensions
          ? [
              {
                name: 'Выбранные файлы',
                extensions: options.extensions,
              },
            ]
          : undefined,
      });

      // Если пользователь отменил выбор
      if (selected === null || Array.isArray(selected)) {
        return null;
      }

      return selected;
    } catch (error) {
      console.error('Ошибка при открытии файла:', error);
      return null;
    }
  }

  /**
   * Сохранить файл
   * @param path Путь к файлу
   * @param content Содержимое файла
   */
  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      // Если путь не указан, показываем диалог сохранения
      let filePath = path;

      if (!filePath) {
        const savePath = await save({
          filters: [
            {
              name: 'Текстовый файл',
              extensions: ['txt'],
            },
          ],
        });

        if (!savePath) {
          return false;
        }

        filePath = savePath;
      }

      await writeTextFile(filePath, content);
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении файла:', error);
      return false;
    }
  }

  /**
   * Прочитать файл
   * @param path Путь к файлу
   */
  async readFile(path: string): Promise<string> {
    try {
      return await readTextFile(path);
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      throw error;
    }
  }
}
