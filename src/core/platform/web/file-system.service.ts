import { FileSystemService } from '../types';

/**
 * Реализация FileSystemService для веб-платформы
 * Использует File System Access API, доступный в современных браузерах
 */
export class WebFileSystemService implements FileSystemService {
  /**
   * Открыть диалог выбора файла
   * @param options Опции диалога
   */
  async openFileDialog(options?: {
    extensions?: string[];
  }): Promise<string | null> {
    try {
      // Проверка поддержки File System Access API
      if (!('showOpenFilePicker' in window)) {
        throw new Error(
          'File System Access API не поддерживается в этом браузере'
        );
      }

      const fileTypes: FilePickerAcceptType[] = [];

      if (options?.extensions?.length) {
        fileTypes.push({
          description: 'Выбранные файлы',
          accept: {
            'application/octet-stream': options.extensions.map(
              (ext) => `.${ext}`
            ),
          },
        });
      }

      const [fileHandle] = await window.showOpenFilePicker({
        types: fileTypes.length ? fileTypes : undefined,
        multiple: false,
      });

      const file = await fileHandle.getFile();
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Ошибка при открытии файла:', error);
      return null;
    }
  }

  /**
   * Сохранить файл
   * @param path Путь к файлу (не используется в веб-версии)
   * @param content Содержимое файла
   */
  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      // Проверка поддержки File System Access API
      if (!('showSaveFilePicker' in window)) {
        // Откат к устаревшему методу
        this.downloadFile('download.txt', content);
        return true;
      }

      const fileHandle = await window.showSaveFilePicker({
        suggestedName: path.split('/').pop() || 'download.txt',
      });

      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      return true;
    } catch (error) {
      console.error('Ошибка при сохранении файла:', error);
      return false;
    }
  }

  /**
   * Прочитать файл
   * @param path Путь к файлу или URL объект
   */
  async readFile(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      throw error;
    }
  }

  /**
   * Скачать файл через blob (запасной метод для браузеров без поддержки File System Access API)
   */
  private downloadFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
